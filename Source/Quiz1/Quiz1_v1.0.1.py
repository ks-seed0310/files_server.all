import random
"""ランダムに問題を出すために必要↑↑↑↑↑↑↑↑"""

Quiz={
    1:"こんにちはを英語で言うと?小文字で答えてね。",
    2:"このプログラムは何言語でできている?小文字で答えてね。",
    3:"このプログラムを一緒に作った池田先生は何の教科?漢字2文字で答えてね",
    4:"Python この読み方は?カタカナで答えてね。",
    5:"このプログラムは私が何個目に作ったプログラム?半角数字で答えてね。",
}
Quiz_answer={
    1:"hello",
    2:"python",
    3:"技術",
    4:"パイソン",
    5:"10",
}
Quiz_point={
    1:1,
    2:3,
    3:2,
    4:3,
    5:5,
}
count=Quiz.__len__()+1
clearcount=0
sav=""
point=0
allpoint=0

def Q ():
    print("\n\n")
    sav=""
    while True :
        sav=input("もう一度、やりますか?  y or n")
        if (sav=="y" or sav=="Y" or sav=="n" or sav=="N"):
            break
        print("\n")

    if (sav=="y" or sav=="Y"):
        print("「もう一度やる」を選択しました。準備中...")
        print("\n")
        play()
    else:
        print("実行なし")
        print("終了です。ありがとうございました。")

def play () :
    count=Quiz.__len__()+1
    clearcount=0
    sav=""
    point=0
    allpoint=0
    while (True) :
        count=input(f"""何問出題? {Quiz.__len__()}問あります。
小数が入力された場合は四捨五入します。
もし数字以外を打つとエラー起こしてプログラム止まりますんでご注意を。""")
        count=float(count)
        count+=0.5
        count=int(count//1)
        if count>=1 :
            sav=input(f"""{count} 問出題しますか? y or n""")
            if (sav=="y" or sav=="Y"):
                print("\n\n")
                break
            else:
                count=Quiz.__len__()+1
                continue
    
    
    for i in range (1,count+1):
        PlayQuizID=random.randint(1,int(Quiz_answer.__len__()))
        QUIZ={
            1:Quiz[PlayQuizID],
            2:Quiz_answer[PlayQuizID],
            3:Quiz_point[PlayQuizID],
        }
        print(QUIZ[1])
        answer=""        
        allpoint+=QUIZ[3]
        while (answer=="" or answer=="/playcommand") :
            answer=input("答えを入力")
            if answer=="" :
                continue

            if answer=="/playcommand" :
                answer=""
                answer=input("""
コマンドを入力。/playcommand command_name object で実行可能です。
/playcommand help all で現在利用可能なコマンドが表示されます。""") 
                if answer=="/playcommand help all" : 
                    print("\n")
                    print("Command Help V.0.0.0\n")
                    print("現在利用可能コマンド一覧\n")
                    print("/playcommand\nコマンド実行のために一番最初に入力する。コマンド入力時に入力しても何も起こらない。\n")
                    print("/playcommand help all\nコマンドヘルプを出すために必要。現在allのオブジェクトに文字を入れて検索できるようにしたい。\n")
                    print("/playcommand question view\n問題を再表示するために必要。改行押しすぎて問題が見えなくなった時いいかも。\n")
                
                if answer=="/playcommand question view":
                    print(QUIZ[1])
                
                answer="/playcommand"
                continue

        if answer==QUIZ[2]:
            clearcount+=1
            point+=QUIZ[3]
            print(f"""正解!!\n+{QUIZ[3]}pt\n\n""")
        else:
            print("残念...\n\n")


    print(f"""
終了!!
正解数: {clearcount} 問 / {count} 問中
得点: {point} 点 / {allpoint} 点(最大)
お疲れ様でした。
""")
    sav=""
    Q()


"""この先実行部分"""


play()
    
