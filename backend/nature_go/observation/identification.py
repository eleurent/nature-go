import json
import logging
import requests
import PIL.Image
import PIL.ExifTags
import datetime

logger = logging.getLogger(__name__)


def plantnet_identify(image_path: str, organ: str, mock: bool = False):
    """Identify a plant though the plantnet API

    Args:
        image_path (str): path to an image file
        organ (str): organ depicted in the image, in [leaf, flower, fruit, bark]
        mock (bool, optional): Mock API call, for testing. Defaults to False.

    Returns:
        dict: PlantNet API response
    """
    if mock:
        return plantnet_identify_mock()
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
    data = {'organs': [organ]}
    response = requests.post(url, files=files, data=data, params=params)
    response.raise_for_status()
    result = response.json()
    return result


def plantnet_identify_mock():
    return json.load(open('observation/mock_plantnet_response.json'))


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
