import openai
import tiktoken
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens
'''
article:dict = {'title:str', 'sections:list'}
sections:list = [section:dict]
section:dict = {'subtitle':str, 'content':str}
'''

class Gpt:
    def __init__(self):
        # OpenAI API key
        openai.api_key = tokens.gpt_key
        # Parameters for the API request
        self.model_engine = 'gpt-3.5-turbo'
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.tokenizer = tiktoken.encoding_for_model("gpt-3.5-turbo")

    def checktoken(self, text):
        return len(self.tokenizer.encode(text))
    
    def getsummary(self):
        # Call the OpenAI GPT API and get the response
        text = ''
        tokenover = len(self.message)
        for i in range(tokenover):
            if (i==0):
                prompt = [{'role': 'user', 'content': f'Summarize the following article in 3 sentences : {self.message[i]}'}]
            elif (i>0):
                prompt = [{'role': 'user', 'content': f'Summarize the following article in 3 sentences : {text} {self.message[i]}'}]
            self.summary = openai.ChatCompletion.create(
                model=self.model_engine,
                messages = prompt,
                # temperature=temperature,
                max_tokens=self.max_tokens,
            )
            text = self.summary['choices'][0]['message']['content']
        return self.summary
    # message set
    # def setmessage(self, type:str = 'sentences', number:int = 5, article: dict, max_tokens: int = 200, temprature: float = 0.5):

    def setmessage(self, article: dict, max_tokens: int = 4000, temprature: float = 0.5):
        # message to generate text from
        self.temperature = temprature
        self.max_tokens = max_tokens
        # message to generate text from
        text = ''
        self.message = []
        for d in article['sections']:
            text = text + (d['content'])
            if (self.checktoken(text) > max_tokens*0.8):
                self.message.append(text)
                #self.prompt.append([{'role': 'user', 'content': f'Summarize the following article in 3 sentences : {text}'}])
                text = ''
        self.message.append(text)

    def raise_difficulty(self):
        text = self.summary['choices'][0]['message']['content']
        self.highdiff = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=[{'role': 'user', 'content': f'Raise the difficulty of the vocabulary a little : {text}'}],
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.highdiff

    def lower_difficulty(self):
        text = self.summary['choices'][0]['message']['content']
        self.lowdiff = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=[{'role': 'user', 'content': f'Lower the difficulty of the vocabulary a bit : {text}'}],
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.lowdiff


#Find paragraphs related to 'keyword'
# Print the generated text from the response
if (__name__ == '__main__'):
    g = Gpt()
    article = {'sections': [{'content': 'Monday marks the 25th anniversary of the Good Friday Agreement, which brought peace to Northern Ireland after a 30-year period of sectarian conflict known as the Troubles. Decades after the Irish War of Independence led to the island’s partition, the conflict escalated in the late 1960s, amid swelling anger at discrimination towards the province’s Irish Catholics. The IRA, mainly comprising Irish Catholics, sought to liberate the north from British rule and reunite it with the Republic of Ireland. This was opposed by the British Army and loyalist paramilitary groups such as the UDA and UVF, mainly comprising Protestants, who sought to keep Northern Ireland a part of the United Kingdom.'}]}
    g.setmessage(article)
    res = g.getsummary()
    print(res)
    # print()
    '''
    print(res['choices'][0]['message']['content'])
    print()
    res = g.raise_difficulty()
    print(res['choices'][0]['message']['content'])
    print()
    res = g.lower_difficulty()
    print(res['choices'][0]['message']['content'])
    '''
