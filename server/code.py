import web
import time
import os
from library import nlp
from library import tts
from library import voiceRecognize

urls = ("/upload", "upload")
app = web.application(urls, globals())

voice = voiceRecognize.voiceRecognize()
voice.load_audio_db("../record/voiceRecognize/audio_db".encode("ascii"))
count_audio = 1

class upload:
    def POST(self):
        data = web.input().speechFile
        
        nowTime = str(int(time.time()))
        mp3_file_name = "./data/" + nowTime + ".mp3"
        with open(mp3_file_name, "wb") as f:
            f.write(data)
        f.close()

        wav_file_name = "./data/" + nowTime + ".wav"
        ffmpeg_command_wav = "ffmpeg -y -i " + mp3_file_name + " -acodec pcm_s16le -f s16le -ac 1 -ar 16000 " + wav_file_name
        os.system(ffmpeg_command_wav)
        
        name, p = self.voice.recognition(wav_file_name)
        print("p : {}\n".format(p))

        ans_file_name = nowTime + "_demo.mp3"
        text = ''

        if p <= 0.71:
            text = "您的语音信息不在语音库中，无法与我沟通我"
        else:
            pcm_file_name = "./data/" + nowTime + ".pcm"
            ffmpeg_command = "ffmpeg -y -i " + mp3_file_name + " -acodec pcm_s16le -f s16le -ac 1 -ar 16000 " + pcm_file_name
            os.system(ffmpeg_command)
            NLP = nlp.nlp(pcm_file_name)
            text, _ = NLP.get_text()

        if text is not None:
            print("answer:",text)
            TTS = tts.tts(text, "./data/" + ans_file_name)  #文字answer转为音频
            TTS.text_to_speech()            

        return ans_file_name
                    

if __name__ == "__main__":
    app.run()