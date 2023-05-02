import os
from google.cloud import translate_v2 as translate
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))


class translator:
    def __init__(self):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'key.json'
        self.client = translate.Client()

    def getresult(self, text):
        result = self.client.translate(text, target_language='ko')
        return result


if __name__ == '__main__':
    t = translator()
    result = t.getresult('Lower the difficulty of the vocabulary a bit')
    # print(result)
    print(result['translatedText'])
