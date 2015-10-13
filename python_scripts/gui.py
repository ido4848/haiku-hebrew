__author__ = 'Ido'

from Tkinter import *

def displayText(data,height,width):
    root = Tk()
    T = Text(root, height=height, width=width)
    T.pack()
    T.insert(END, data)
    mainloop()


