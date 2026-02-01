'use client';

interface ExifData {
  location?: {
    latitude: number;
    longitude: number;
  };
  datetime?: string;
}

export async function extractExifData(file: File): Promise<ExifData> {
  const result: ExifData = {};

  try {
    const exifr = await import('exifr');
    const exif = await exifr.parse(file, {
      pick: [
        'GPSLatitude',
        'GPSLatitudeRef',
        'GPSLongitude',
        'GPSLongitudeRef',
        'DateTimeOriginal',
        'CreateDate',
      ],
      gps: true,
    });

    if (exif) {
      if (exif.latitude !== undefined && exif.longitude !== undefined) {
        result.location = {
          latitude: exif.latitude,
          longitude: exif.longitude,
        };
      }

      const dateStr = exif.DateTimeOriginal || exif.CreateDate;
      if (dateStr) {
        if (dateStr instanceof Date) {
          result.datetime = dateStr.toISOString();
        } else if (typeof dateStr === 'string') {
          const parts = dateStr.split(' ');
          if (parts.length === 2) {
            const datePart = parts[0].replace(/:/g, '-');
            result.datetime = `${datePart}T${parts[1]}`;
          }
        }
      }
    }
  } catch (error) {
    console.error('EXIF extraction error:', error);
  }

  return result;
}
