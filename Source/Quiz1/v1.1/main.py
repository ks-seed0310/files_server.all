#(c) 2024-2025 Rintaro Takeda
#Quiz1 v1.1
#Quiz1 version: Version 1.1.0.3
import random as rd
import math as Math

from imp1 import *
from imp2 import *
from imp3 import *
"""クイズ問題の編集はq1_v1p1_imp3.pyからどうぞ"""

data={
    "temporary":"",
    "temporary_1":"",
    "input":None,
    "quiz_count":"",
    "quiz":{
        
    },
    "pointALL":0,
}
play={
    "point":0,
    "clear":0,
    "":0,
}
def reset(play_,data_):
    global data
    global play
    if data_:
        data={
            "temporary":"",
            "temporary_1":"",
            "input":None,
            "quiz_count":"",
            "quiz":{
        
            },
            "pointALL":0,
        }
    if play_:
        play={
            "point":0,
            "clear":0,
            "":0,
        }

def quizcount_query():
    global data
    while True:
        print("何問出題しますか?問題数を入力してください。1問から1024問まで対応です。")
        data["temporary"]=input("ここに入力")
        try:
            data["temporary"]=float(data["temporary"])
            if data["temporary"]<1 or data["temporary"]>1024:
                #ただの制限なので or data["temporary"]>1024のところは変更して大丈夫です
                raise ValueError()
            data["temporary"]+=0.5
            data["temporary"]=int(data["temporary"])
            while not(data["temporary_1"]=="y" or data["temporary_1"]=="n"):
                print(data["temporary"]," 問に決定しますか?")
                data["temporary_1"]=input("y or n")
            if data["temporary_1"]=="y":
                data["quiz_count"]=data["temporary"]
                data["temporary_1"]=None
                break
            else:
                data["temporary"]=None
                data["temporary_1"]=None
                continue
        except:
            print("無効な入力です。入力し直してください。\n")
    quiz_()

def quiz_():
    global data
    global QuizData
    reset(data_=False,play_=True)
    data["pointALL"]=0
    for count_____ in range(1,data["quiz_count"]+1):
        data["Q_Num"]=rd.randint(0,len(QuizText)-1)
        QuizData=[
            QuizText[data["Q_Num"]],
            QuizAnswer[data["Q_Num"]],
            QuizPoint[data["Q_Num"]],
            QuizCheck[data["Q_Num"]],
        ]
        while True:
            try:
                print(count_____," 問目\n",QuizData[0])
                data["temporary_2"]=input("ここに答えを入力")
                data["pointALL"]+=QuizData[2]
                if QuizData[3]:
                    data["temporary_2"]=split_2(data["temporary_2"])
                    if textcheck(data["temporary_2"], QuizData[1]):
                        print("正解!!\n+",QuizData[2],"point","\n")
                        play["point"]+=QuizData[2]
                        play["clear"]+=1
                        break
                    else:
                        if data["temporary_2"]==[]:
                            continue
                        print("不正解。\n入力:",data["temporary_2"],"\n","解答:",QuizData[1],"\n")
                        break
                else:
                    if data["temporary_2"]==QuizData[1]:
                        print("正解!!\n+",QuizData[2],"point","\n")
                        play["point"]+=QuizData[2]
                        play["clear"]+=1
                        break
                    else:
                        if data["temporary_2"]==[]:
                            continue
                        print("不正解。\n入力:",data["temporary_2"],"\n","解答:",QuizData[1],"\n")
                        break
            except:
                print("\n入力エラーまたは認識エラーです\n")
    quiz_end()
    

def textcheck(input, answer):
    text_=[input,split_2(answer)]
    temp=True
    if len(text_[0])!=len(text_[1]):
        return False
    for i in range(0,len(text_[0]),1):
        i2=input[i]
        try:
            data["temporary_3"]=List[search_key(List,i2)][i2]
        except:
            data["temporary_3"]=None
        try:
            data["temporary_4"]=list(List[search_value(List,i2)])[search_key(List[search_value(List,i2)].values(),i2)]
        except:
            data["temporary_4"]=None
        temp=((temp) and ((data["temporary_3"]==text_[1][i])or(data["temporary_4"]==text_[1][i])or(i2==text_[1][i])))
        if not(temp):
            break
    return temp

def quiz_end():
    print(f"""

クイズ終了!
　　クイズ数: {data["quiz_count"]} 問
　　　正解数: {play['clear']} 問
　　不正解数: {data["quiz_count"]-play['clear']} 問
　　　　得点: {play['point']} 点
　　最大得点: {data["pointALL"]} 点
百点満点得点: {Math.floor((play['point']/data["pointALL"])*1000000)/10000} 点
　　　正解率: {Math.floor((play['clear']/data["quiz_count"])*1000000)/10000} %

もう一度実行する場合は y を、もう実行しない場合は n を入力してください。
""")
    answer=None
    while not(answer=="y" or answer=="n"):
        answer=input("ここに入力")
    if answer=="y":
        print("もう一度実行します。\n\n")
        quizcount_query()
        return True
    elif answer=="n":
        print("お疲れ様でした。またやってみてください!ぜひアイデアなど教えてください〜!!")
        return False

quizcount_query()
