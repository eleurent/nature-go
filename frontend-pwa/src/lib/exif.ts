interface Location {
  latitude: number;
  longitude: number;
}

interface ExifData {
  location?: Location;
  datetime?: string;
}

function convertDMSToDD(dms: number[], ref: string): number {
  const degrees = dms[0] || 0;
  const minutes = dms[1] || 0;
  const seconds = dms[2] || 0;
  
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (ref === 'S' || ref === 'W') {
    dd = -dd;
  }
  return dd;
}

function getExifValue(dataView: DataView, offset: number, littleEndian: boolean): number[] {
  const numComponents = dataView.getUint32(offset + 4, littleEndian);
  const valueOffset = dataView.getUint32(offset + 8, littleEndian);
  
  const values: number[] = [];
  for (let i = 0; i < numComponents; i++) {
    const numerator = dataView.getUint32(valueOffset + i * 8, littleEndian);
    const denominator = dataView.getUint32(valueOffset + i * 8 + 4, littleEndian);
    values.push(denominator ? numerator / denominator : 0);
  }
  return values;
}

export async function extractExifData(file: File): Promise<ExifData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result: ExifData = {};
      
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const dataView = new DataView(buffer);
        
        if (dataView.getUint16(0) !== 0xFFD8) {
          resolve(result);
          return;
        }
        
        let offset = 2;
        while (offset < dataView.byteLength) {
          const marker = dataView.getUint16(offset);
          
          if (marker === 0xFFE1) {
            const exifHeader = dataView.getUint32(offset + 4);
            if (exifHeader === 0x45786966) {
              const tiffOffset = offset + 10;
              const littleEndian = dataView.getUint16(tiffOffset) === 0x4949;
              
              const ifdOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
              const numEntries = dataView.getUint16(tiffOffset + ifdOffset, littleEndian);
              
              let gpsOffset: number | null = null;
              let exifOffset: number | null = null;
              
              for (let i = 0; i < numEntries; i++) {
                const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
                const tag = dataView.getUint16(entryOffset, littleEndian);
                
                if (tag === 0x8825) {
                  gpsOffset = dataView.getUint32(entryOffset + 8, littleEndian);
                } else if (tag === 0x8769) {
                  exifOffset = dataView.getUint32(entryOffset + 8, littleEndian);
                }
              }
              
              if (exifOffset !== null) {
                const exifIfdOffset = tiffOffset + exifOffset;
                const exifEntries = dataView.getUint16(exifIfdOffset, littleEndian);
                
                for (let i = 0; i < exifEntries; i++) {
                  const entryOffset = exifIfdOffset + 2 + i * 12;
                  const tag = dataView.getUint16(entryOffset, littleEndian);
                  
                  if (tag === 0x9003) {
                    const valueOffset = dataView.getUint32(entryOffset + 8, littleEndian);
                    let datetime = '';
                    for (let j = 0; j < 19; j++) {
                      datetime += String.fromCharCode(dataView.getUint8(tiffOffset + valueOffset + j));
                    }
                    const [datePart, timePart] = datetime.split(' ');
                    if (datePart && timePart) {
                      result.datetime = `${datePart.replace(/:/g, '-')}T${timePart}`;
                    }
                    break;
                  }
                }
              }
              
              if (gpsOffset !== null) {
                const gpsIfdOffset = tiffOffset + gpsOffset;
                const gpsEntries = dataView.getUint16(gpsIfdOffset, littleEndian);
                
                let latRef = 'N', lonRef = 'E';
                let lat: number[] | null = null, lon: number[] | null = null;
                
                for (let i = 0; i < gpsEntries; i++) {
                  const entryOffset = gpsIfdOffset + 2 + i * 12;
                  const tag = dataView.getUint16(entryOffset, littleEndian);
                  
                  if (tag === 0x0001) {
                    latRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
                  } else if (tag === 0x0002) {
                    lat = getExifValue(dataView, entryOffset, littleEndian);
                  } else if (tag === 0x0003) {
                    lonRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
                  } else if (tag === 0x0004) {
                    lon = getExifValue(dataView, entryOffset, littleEndian);
                  }
                }
                
                if (lat && lon) {
                  result.location = {
                    latitude: convertDMSToDD(lat, latRef),
                    longitude: convertDMSToDD(lon, lonRef),
                  };
                }
              }
            }
            break;
          }
          
          offset += 2 + dataView.getUint16(offset + 2);
        }
      } catch {
        // Silently fail if EXIF parsing fails
      }
      
      resolve(result);
    };
    
    reader.onerror = () => resolve({});
    reader.readAsArrayBuffer(file);
  });
}
