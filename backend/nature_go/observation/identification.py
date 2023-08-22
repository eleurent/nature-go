import logging
import requests
import PIL.Image
import PIL.ExifTags
import datetime

logger = logging.getLogger(__name__)


def plantnet_identify(image_path):
    url = 'https://my-api.plantnet.org/v2/identify/all'
    image_data =  open(image_path, 'rb')
    files = [
        ('images', (image_path, image_data))
    ]
    params = {
        'include-related-images': True,
        'lang': 'en',
        'api-key': '2b10OHTHDcLlYXiJYoOA2bYeOO'
    }
    data = {'organs': ['flower']}
    response = requests.post(url, files=files, data=data, params=params)
    response.raise_for_status()
    result = response.json()
    return result


def read_exif(image_path):
    location = {}
    datetime_ = ''
    img = PIL.Image.open(image_path)
    exif = img._getexif()
    if not exif:
        logger.error('No exif found.')
    else:
        exif = {PIL.ExifTags.TAGS[k]: v
                for k, v in exif.items() if k in PIL.ExifTags.TAGS}
        location = {PIL.ExifTags.GPSTAGS.get(key,key): str(exif['GPSInfo'][key])
                    for key in exif.get('GPSInfo', {})}
        datetime_ = exif.get('DateTime', '')
    if datetime_:
        datetime_ = datetime.datetime.strptime(datetime_, '%Y:%m:%d %H:%M:%S')
    else:
        logger.error('Found no datetime, setting it to now.')
        datetime_ = datetime.datetime.now()
    return location, datetime_
