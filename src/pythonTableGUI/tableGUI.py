#import RPi.GPIO as GPIO
import os
import serial
import sys

import threading
from threading import Thread
import multiprocessing
from multiprocessing import Process
import datetime

tempPort = '/dev/ttyUSB0'
tempBaud = 9600

tempPortPC = 'COM9'

import cStringIO

PC_POWER = 23
powerState = 1
ledState = 1

#serLED =  serial.Serial('/dev/ttyACM0', 9600)
#serTEMP = serial.Serial(tempPort, tempBaud, timeout = 0.05)
serTEMP = serial.Serial(tempPortPC, tempBaud, timeout = 0.05)


import matplotlib
matplotlib.use("TkAgg")

import datetime
from datetime import datetime
import time

from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2TkAgg
from matplotlib.figure import Figure


#Possible uncomment
import matplotlib.animation as animation
from matplotlib import style

##Possible uncomment##
#import numpy
#import serial
#import matplotlib.pyplot as plt
#from drawnow import *
##End uncomment##

##more##
import urllib
import json
#import pandas as pd
#import numpy as np
##end more##

import Tkinter as tk
from Tkinter import HORIZONTAL
import tkFont
import ttk



#LARGE_FONT= ("Verdana", 12)
style.use("dark_background")

#powerFont = tkFont.Font(family = 'Arial', size = 36, weight = 'bold')
#tabFont = tkFont.Font(family = 'Arial', size = 14, weight = 'bold')

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 480

MASTER_BG_COLOUR = "#1A1A1A"

START_PAGE_BG = "#1A1A1A"
START_PAGE_FG = "#A73E3E"

START_PAGE_FONT = ("Arial", 30, 'bold')

TAB_WIDTH = 7
TAB_HEIGHT = 1
TAB_PAD_X = 38
TAB_PAD_Y = 10
TAB_ACTIVE_BG_COLOUR = "#878787"
TAB_ACTIVE_FG_COLOUR = "#262626"
TAB_NORMAL_BG_COLOUR = "#707070"
TAB_NORMAL_FG_COLOUR = "#262626"
TAB_FONT_FAMILY = 'Arial'
TAB_FONT_SIZE = 18
TAB_FONT_WEIGHT = 'bold'

TEMP_CANVAS_WIDTH = 450
TEMP_CANVAS_HEIGHT = 300

TEMP_FONT = ("Arial", 16, 'bold')


#4141f4
#41f4f4
#41f441
#f4f441
#f44141






LED_PROG_WIDTH = 7
LED_PROG_HEIGHT = 1
LED_PROG_PAD_X = 38
LED_PROG_PAD_Y = 22
LED_PROG_ACTIVE_BG_COLOUR = "#832F24"
LED_PROG_ACTIVE_FG_COLOUR = "#262626"
LED_PROG_NORMAL_BG_COLOUR = "#878787"
LED_PROG_NORMAL_FG_COLOUR = "#262626"
LED_PROG_FONT_FAMILY = 'Arial'
LED_PROG_FONT_SIZE = 18
LED_PROG_FONT_WEIGHT = 'bold'

LED_SLIDER_WIDTH = 400
LED_SLIDER_HEIGHT = 40
LED_SLIDER_FONT = ("Arial", 20, 'bold')



LED_SWITCH_FONT = ("Arial", 16, 'bold')
LED_SWITCH_ACTIVE_COLOUR = "#607625"
LED_SWITCH_NORMAL_COLOUR = "#F2F2F2"


f = Figure(figsize=(3.3,4), dpi=100)
a = f.add_subplot(111)

tempTimeConst = 0

tempTestValue = 0
tempTestDir = 1

TEMP_TIME_POINTS = 50

rgbwSliderValue = "#%02x%02x%02x%02x" % (0, 0, 0, 0)
progState = 0
tempPoints = []


MAX_FAN_RPM = 185
MIN_FAN_RPM = 40

a2="T"
b2=-21.2
c2=10.3
d2=2.4
e2=3.5
f2=5.6
g2=4.7

temp1labelColour = "#607625"

temperatureList = []
fanSpeedList = []

temperatureList.append([])
temperatureList.append([])
temperatureList.append([])
temperatureList.append([])
temperatureList.append([])
temperatureList.append([])


MAX_TEMP_THRESHOLD = 100
CRITICAL_TEMP_THRESHOLD = 50
HIGH_TEMP_THRESHOLD = 40
MID_TEMP_THRESHOLD = 10
LOW_TEMP_THRESHOLD = -10

CRITICAL_TEMP_COLOUR = "#F44141"
HIGH_TEMP_COLOUR = "#F4F441"
MID_TEMP_COLOUR = "#41F441"
LOW_TEMP_COLOUR = "#4141F4"

temperatureString = ""
fanSpeedString = ""



FORMAT = '%Y%m%d%H%M%S'
path = 'tempAndFan_LOG.txt'
data = 'data to be written to the file\n'
new_path = '%s_%s' % (datetime.now().strftime(FORMAT), path)
#open(new_path, 'w').write(data)

def getTempAndFanStats():
    while(True):   
        global tempTimeConst
        global temperatureList
        global TEMP_TIME_POINTS
        global tempPoints

        global fanSpeedString

        
        
        temperatureString = "T,0,0,0,0,0,0"

        time.sleep(0.90) 
        serTEMP.write("T")
        time.sleep(0.1)    
        while serTEMP.inWaiting():
            temperatureString = serTEMP.readline()
            temperatureString = temperatureString[:-2]
            if temperatureString == "Incorrect Command!":
                temperatureString = "T,0,0,0,0,0,0"

        print temperatureString
            
        t0, t1, t2, t3, t4, t5, t6 = temperatureString.split(',')
        temperatureList[0].append(float(t1)/100)
        temperatureList[1].append(float(t2)/100)
        temperatureList[2].append(float(t3)/100)
        temperatureList[3].append(float(t4)/100)
        temperatureList[4].append(float(t5)/100)
        temperatureList[5].append(float(t6)/100)

        if tempTimeConst < TEMP_TIME_POINTS:
            tempPoints.append(tempTimeConst)
            tempTimeConst += 1

        if  len(temperatureList[0]) > TEMP_TIME_POINTS:
            while len(temperatureList[0]) > TEMP_TIME_POINTS:
                temperatureList[0].pop(0)
                temperatureList[1].pop(0)
                temperatureList[2].pop(0)
                temperatureList[3].pop(0)
                temperatureList[4].pop(0)
                temperatureList[5].pop(0)


        #fanSpeedString = "S,0,0,0,0"
        #serTEMP.write("S")
        #time.sleep(0.05) 

        #while serTEMP.inWaiting():
        #    fanSpeedString = serTEMP.readline()
        #    fanSpeedString = fanSpeedString[:-2]

        #s0, s1, s2, s3, s4 = temperatureString.split(',')
        #fanSpeedList[0] = int(s1)
        #fanSpeedList[1] = int(s2)
        #fanSpeedList[2] = int(s3)
        #fanSpeedList[3] = int(s4)
        

        #timeStamp = datetime.datetime.fromtimestamp(time.time())
        #datetime.datetime.now().strftime(fmt).format(fname=fname)
        #print timeStamp.date
        
        #newLogFile = open(datetime.datetime.fromtimestamp(time.time()),"a")
        #pushData.write(tempAndFanInfoWrite + '\n')

        #tempAndFanInfoWrite = datetime.datetime.fromtimestamp(time.time()) + '|' + temperatureString ++ '|' + humidityString ++ '|' + fanSpeedString ++ '|' + fanSpeedErrorString
        
        #pushData =  open("samp.txt", "a")  
        #pushData.write(tempAndFanInfoWrite + '\n')


def logTempAndFanStats():
    global temperatureString
    while True:
        time.sleep(1)
        timeStamp = '%s' % (datetime.now().strftime('%Y%m%d%H%M%S'))
        temperatureStringLog = str(temperatureString) + str("\n")
        

        tempAndFanlogString = str(timeStamp) + ',' + str(temperatureString[2:]) + '\n'
        pushData = open(new_path, 'a').write(tempAndFanlogString)
        print "To log file:  " + tempAndFanlogString
        print type(temperatureString)
        time.sleep(2)


def animate_thread(i):
    Thread(name = 'temperature_page_thread', target = animate , args = (i,)).start()
    #multiprocessing.Process(name = 'temperature_page_thread', target = animate , args = (i,)).start()
    #animate(i)



##### THIS HAS TO RUN PARALLEL ON SEPARATE CORE!!!!!!!!!!
##### above function is an attempt to do that also look at bottom of code
##### at FuncAnimation
def animate(i):

    timeStamp = time.time()
    
    global temperatureList
    global TEMP_TIME_POINTS
    global tempPoints
    
    #serTEMP.write("H")
    #while serTEMP.available():
    #if serTEMP.available():
        #humidityString = serTEMP.readline()
    
    #serTEMP.write("S")
    #while serTEMP.available():
    #if serTEMP.available():
        #fanSpeedString = serTEMP.readline()

    #serTEMP.write("E")
    #while serTEMP.available():
    #if serTEMP.available():
        #fanSpeedErrorString = serTEMP.readline()

    #pushData =  open("samp.txt", "a")

    #newLogFile = open(datetime.datetime.fromtimestamp(time.time()),"a")

    #tempAndFanInfoWrite = datetime.datetime.fromtimestamp(time.time()) + '|' + temperatureString ++ '|' + humidityString ++ '|' + fanSpeedString ++ '|' + fanSpeedErrorString
      
    #pushData.write(tempAndFanInfoWrite + '\n')

    #pullData = open("samp.txt", "r").readlines()
    #pullData = pullData[-(2+tempTimeConst):]
    #temperaturedataList = [i.split('\n')[0] for i in pullData]

    #dataList = dataList[-(1+tempTimeConst):]



    #temperatureString = str(a2) + ',' + str(b2) + ',' + str(c2) + ',' + str(d2) + ',' + str(e2) + ',' + str(f2) + ',' + str(g2)
    
    #b2 = b2+1
    #c2 = c2 + 1

    timeStamp = time.time()
    time.sleep(0.5)
    
    a.clear()
    a.set_xlim([0,TEMP_TIME_POINTS])
    a.set_ylim([-10,60])
    a.plot(tempPoints, temperatureList[0], tempPoints, temperatureList[1], tempPoints, temperatureList[2], tempPoints, temperatureList[3], tempPoints, temperatureList[4], tempPoints, temperatureList[5])
  

    print time.time() - timeStamp
    

class pcControlSystem(tk.Tk):

    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self, *args, **kwargs)
        #tk.Tk.iconbitmap(self, default="pcControllerICON.bmp")
        tk.Tk.wm_title(self, "PC Control System v1.0")
        container = tk.Frame(self)
        #container.grid(row = 0, column = 0)
        container.pack(side="top", fill="both", expand = True)
        container.grid_rowconfigure(0, weight=1)
        container.grid_columnconfigure(0, weight=1)
        self.frames = {}
        for F in (StartPage, HomePage, PageOne, PageTwo, PageThree, PageFour):
            frame = F(container, self)
            self.frames[F] = frame
            frame.grid(row=0, column=0, sticky="nsew")
            frame.config(bg=MASTER_BG_COLOUR)
        self.show_frame(StartPage)


    def show_frame(self, cont):
        frame = self.frames[cont]
        frame.tkraise()


class StartPage(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self,parent)
        bitmap = tk.BitmapImage(file="welcomeScreen_BG.xbm")
        startPageCanvas = tk.Canvas(self, relief = tk.FLAT, width=800, height=480, bg=START_PAGE_BG)
        startPageCanvas.grid(row = 2, column = 2, columnspan = 3, sticky = "nw")
        Canvas_Image = startPageCanvas.create_image(0,0, image=bitmap)

        label = tk.Label(self, text="Welcome", font=START_PAGE_FONT, bg=START_PAGE_BG, fg=START_PAGE_FG)
        labelW = startPageCanvas.create_window((SCREEN_WIDTH/2), (SCREEN_HEIGHT/2)-100, anchor = "nw", window = label)

        button1 = ttk.Button(self, text="START", command = lambda:controller.show_frame(HomePage))
        button1W = startPageCanvas.create_window((SCREEN_WIDTH/2), (SCREEN_HEIGHT/2), anchor = "nw", window = button1)

        
        
        
        #button1.grid()

class HomePage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)


    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        #label = tk.Label(self, text="Homepage", font=LARGE_FONT)
        #label.pack(pady=10,padx=10)
        button1 = tk.Button(self, text="HOME",
                            command = lambda:controller.show_frame(HomePage), bg=TAB_ACTIVE_BG_COLOUR, fg=TAB_ACTIVE_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button1.grid(row = 0, column = 0)
        button2 = tk.Button(self, text="POWER",
                            command = lambda:controller.show_frame(PageOne), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button2.grid(row = 0, column = 1)
        button3 = tk.Button(self, text="STATS",
                            command = lambda:controller.show_frame(PageTwo), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button3.grid(row = 0, column = 2)
        button4 = tk.Button(self, text="TEMP",
                            command = lambda:controller.show_frame(PageThree), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button4.grid(row = 0, column = 3)
        button5 = tk.Button(self, text="LED",
                            command = lambda:controller.show_frame(PageFour), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button5.grid(row = 0, column = 4)

        exitButton = tk.Button(self, text="EXIT", command = exitProgram)
        exitButton.grid(row = 1, column = 0, pady = 300)

##Power##
class PageOne(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        #label = tk.Label(self, text="HOME", font=LARGE_FONT)
        #label.pack(pady=10,padx=10)
        button1 = tk.Button(self, text="HOME",
                            command = lambda:controller.show_frame(HomePage), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button1.grid(row = 0, column = 0)
        button2 = tk.Button(self, text="POWER",
                            command = lambda:controller.show_frame(PageOne), bg=TAB_ACTIVE_BG_COLOUR, fg=TAB_ACTIVE_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button2.grid(row = 0, column = 1)
        button3 = tk.Button(self, text="STATS",
                            command = lambda:controller.show_frame(PageTwo), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button3.grid(row = 0, column = 2)
        button4 = tk.Button(self, text="TEMP",
                            command = lambda:controller.show_frame(PageThree), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button4.grid(row = 0, column = 3)
        button5 = tk.Button(self, text="LED",
                            command = lambda:controller.show_frame(PageFour), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button5.grid(row = 0, column = 4)

        ttk.Style().configure("button1", background="green")



##Stats##
class PageTwo(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        #label = tk.Label(self, text="page two", font=LARGE_FONT)
        #label.pack(pady=10,padx=10)
        button1 = tk.Button(self, text="HOME",
                            command = lambda:controller.show_frame(HomePage), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button1.grid(row = 0, column = 0)
        button2 = tk.Button(self, text="POWER",
                            command = lambda:controller.show_frame(PageOne), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button2.grid(row = 0, column = 1)
        button3 = tk.Button(self, text="STATS",
                            command = lambda:controller.show_frame(PageTwo), bg=TAB_ACTIVE_BG_COLOUR, fg=TAB_ACTIVE_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button3.grid(row = 0, column = 2)
        button4 = tk.Button(self, text="TEMP",
                            command = lambda:controller.show_frame(PageThree), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button4.grid(row = 0, column = 3)
        button5 = tk.Button(self, text="LED",
                            command = lambda:controller.show_frame(PageFour), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button5.grid(row = 0, column = 4)

##Temp##
class PageThree(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        #label = tk.Label(self, text="graph page", font=LARGE_FONT)
        #label.pack(pady=10,padx=10)
        button1 = tk.Button(self, text="HOME",
                            command = lambda:controller.show_frame(HomePage), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button1.grid(row = 0, column = 0)
        button2 = tk.Button(self, text="POWER",
                            command = lambda:controller.show_frame(PageOne), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button2.grid(row = 0, column = 1)
        button3 = tk.Button(self, text="STATS",
                            command = lambda:controller.show_frame(PageTwo), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button3.grid(row = 0, column = 2)
        button4 = tk.Button(self, text="TEMP",
                            command = lambda:controller.show_frame(PageThree), bg=TAB_ACTIVE_BG_COLOUR, fg=TAB_ACTIVE_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button4.grid(row = 0, column = 3)
        button5 = tk.Button(self, text="LED",
                            command = lambda:controller.show_frame(PageFour), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button5.grid(row = 0, column = 4)

        ##begin temperature##
        global temp1labelColour
        temperatureCanvas = tk.Canvas(self, relief = tk.FLAT, bg="#454545", width=TEMP_CANVAS_WIDTH, height=TEMP_CANVAS_HEIGHT)
        temperatureCanvas.grid(row = 2, column = 2, columnspan = 3, sticky = "SE")

        

        temperatureLabel1 = tk.Label(self, text="XX.XoC", font=TEMP_FONT, bg = temp1labelColour)
        temperatureLabel1W = temperatureCanvas.create_window(10, TEMP_CANVAS_HEIGHT - 40, anchor = "nw", window = temperatureLabel1)

        temperatureLabel2 = tk.Label(self, text="XX.XoC", font=TEMP_FONT)
        temperatureLabel2W = temperatureCanvas.create_window(10, (TEMP_CANVAS_HEIGHT/2) - (40/2), anchor = "nw", window = temperatureLabel2)

        temperatureLabel3 = tk.Label(self, text="XX.XoC", font=TEMP_FONT)
        temperatureLabel3W = temperatureCanvas.create_window(10, 10, anchor = "nw", window = temperatureLabel3)


        temperatureLabel4 = tk.Label(self, text="XX.XoC", font=TEMP_FONT)
        temperatureLabel4W = temperatureCanvas.create_window(TEMP_CANVAS_WIDTH - 90, 10, anchor = "nw", window = temperatureLabel4)

        temperatureLabel5 = tk.Label(self, text="XX.XoC", font=TEMP_FONT)
        temperatureLabel5W = temperatureCanvas.create_window(TEMP_CANVAS_WIDTH - 90, (TEMP_CANVAS_HEIGHT/2) - (40/2), anchor = "nw", window = temperatureLabel5)
        
        temperatureLabel6 = tk.Label(self, text="XX.XoC", font=TEMP_FONT)
        temperatureLabel6W = temperatureCanvas.create_window(TEMP_CANVAS_WIDTH - 90, TEMP_CANVAS_HEIGHT - 40, anchor = "nw", window = temperatureLabel6)

        def counter_label(label, sensorIndex):
            def count():
                global t1List
                if len(temperatureList[sensorIndex]) >= 1:
                    label.config(text=str(temperatureList[sensorIndex][-1]) + u'\N{DEGREE SIGN}'.encode('utf-8') + 'C')

                    if(temperatureList[sensorIndex][-1] >= CRITICAL_TEMP_THRESHOLD and temperatureList[sensorIndex][-1]< MAX_TEMP_THRESHOLD):
                        label.config(bg = CRITICAL_TEMP_COLOUR)
                    elif(temperatureList[sensorIndex][-1] >= HIGH_TEMP_THRESHOLD):
                        label.config(bg = HIGH_TEMP_COLOUR)
                    elif(temperatureList[sensorIndex][-1] >= MID_TEMP_THRESHOLD):
                        label.config(bg = MID_TEMP_COLOUR)
                    elif(temperatureList[sensorIndex][-1] >= LOW_TEMP_THRESHOLD):
                        label.config(bg = LOW_TEMP_COLOUR)
                    else:
                        label.config(text= "xx"+ u'\N{DEGREE SIGN}'.encode('utf-8') + 'C')
                        
                label.after(1000, count)
            count()
        
        counter_label(temperatureLabel1, 0)
        counter_label(temperatureLabel2, 1)
        counter_label(temperatureLabel3, 2)
        counter_label(temperatureLabel4, 3)
        counter_label(temperatureLabel5, 4)
        counter_label(temperatureLabel6, 5)


        canvas = FigureCanvasTkAgg(f, self)
        canvas.show()
        canvas.get_tk_widget().grid(row = 1, column = 0, rowspan = 2, columnspan=2)

        ##Uncomment to show navigationbar##
        #toolbar = NavigationToolbar2TkAgg(canvas, self)
        #canvas._tkcanvas.grid(row = 2, column = 0)
        ##End Uncomment##


##LED##
class PageFour(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        #label = tk.Label(self, text="LED", font=LARGE_FONT)
        #label.pack(pady=10,padx=10)

        button1 = tk.Button(self, text="HOME",
                            command = lambda:controller.show_frame(HomePage), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button1.grid(row = 0, column = 0)
        button2 = tk.Button(self, text="POWER",
                            command = lambda:controller.show_frame(PageOne), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button2.grid(row = 0, column = 1)
        button3 = tk.Button(self, text="STATS",
                            command = lambda:controller.show_frame(PageTwo), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button3.grid(row = 0, column = 2)
        button4 = tk.Button(self, text="TEMP",
                            command = lambda:controller.show_frame(PageThree), bg=TAB_NORMAL_BG_COLOUR, fg=TAB_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button4.grid(row = 0, column = 3)
        button5 = tk.Button(self, text="LED",
                            command = lambda:controller.show_frame(PageFour), bg=TAB_ACTIVE_BG_COLOUR, fg=TAB_ACTIVE_FG_COLOUR,
                            font=tkFont.Font(family = TAB_FONT_FAMILY, size = TAB_FONT_SIZE, weight = TAB_FONT_WEIGHT),
                            padx = TAB_PAD_X, pady = TAB_PAD_Y)
        button5.grid(row = 0, column = 4)


        ##led program section##
        self.progButton1 = tk.Button(self, text="1", command = lambda:self.startProgramRGBW(1), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton1.grid(row = 2, column = 0, sticky = "NESW")
        self.progButton2 = tk.Button(self, text="2", command = lambda:self.startProgramRGBW(2), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton2.grid(row = 3, column = 0, sticky = "NESW")
        self.progButton3 = tk.Button(self, text="3", command = lambda:self.startProgramRGBW(3), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton3.grid(row = 4, column = 0, sticky = "NESW")
        self.progButton4 = tk.Button(self, text="4", command = lambda:self.startProgramRGBW(4), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton4.grid(row = 5, column = 0, sticky = "NESW")

        self.progButton5 = tk.Button(self, text="5", command = lambda:self.startProgramRGBW(5), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton5.grid(row = 2, column = 1, sticky = "NESW")
        self.progButton6 = tk.Button(self, text="6", command = lambda:self.startProgramRGBW(6), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton6.grid(row = 3, column = 1, sticky = "NESW")
        self.progButton7 = tk.Button(self, text="7", command = lambda:self.startProgramRGBW(7), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton7.grid(row = 4, column = 1, sticky = "NESW")
        self.progButton8 = tk.Button(self, text="8", command = lambda:self.startProgramRGBW(8), bg=LED_PROG_NORMAL_BG_COLOUR, fg=LED_PROG_NORMAL_FG_COLOUR,
                            font=tkFont.Font(family = LED_PROG_FONT_FAMILY, size = LED_PROG_FONT_SIZE, weight = LED_PROG_FONT_WEIGHT),
                            padx = LED_PROG_PAD_X, pady = LED_PROG_PAD_Y)
        self.progButton8.grid(row = 5, column = 1, sticky = "NESW")


        
        ##end of led program section##


        ##led slider section##

        self.redSlider = tk.Scale(self, orient = HORIZONTAL, length = LED_SLIDER_WIDTH, width = LED_SLIDER_HEIGHT,
                             sliderlength = 50, from_ = 0, to = 255, tickinterval = 255, command = self.updateValueFromSliderRGBW,
                                  bg=MASTER_BG_COLOUR)
        self.redSlider.grid(row = 2, column = 2, columnspan = 3, sticky = "E")
        self.greenSlider = tk.Scale(self, orient = HORIZONTAL, length = LED_SLIDER_WIDTH, width = LED_SLIDER_HEIGHT,
                             sliderlength = 50, from_ = 0, to = 255, tickinterval = 255, command = self.updateValueFromSliderRGBW,
                                    bg=MASTER_BG_COLOUR)
        self.greenSlider.grid(row = 3, column = 2, columnspan = 3, sticky = "E")
        self.blueSlider = tk.Scale(self, orient = HORIZONTAL, length = LED_SLIDER_WIDTH, width = LED_SLIDER_HEIGHT,
                             sliderlength = 50, from_ = 0, to = 255, tickinterval = 255, command = self.updateValueFromSliderRGBW,
                                   bg=MASTER_BG_COLOUR)
        self.blueSlider.grid(row = 4, column = 2, columnspan = 3, sticky = "E")
        self.whiteSlider = tk.Scale(self, orient = HORIZONTAL, length = LED_SLIDER_WIDTH, width = LED_SLIDER_HEIGHT,
                             sliderlength = 50, from_ = 0, to = 255, tickinterval = 255, command = self.updateValueFromSliderRGBW,
                                    bg=MASTER_BG_COLOUR)
        self.whiteSlider.grid(row = 5, column = 2, columnspan = 3, sticky = "E")


        redSliderLabel = tk.Label(self, text="R:", font=LED_SLIDER_FONT, fg="#CC0000", bg=MASTER_BG_COLOUR)
        redSliderLabel.grid(row = 2, column = 2, sticky = "W")
        greenSliderLabel = tk.Label(self, text="G:", font=LED_SLIDER_FONT, fg="#00CC00", bg=MASTER_BG_COLOUR)
        greenSliderLabel.grid(row = 3, column = 2, sticky = "W")
        blueSliderLabel = tk.Label(self, text="B:", font=LED_SLIDER_FONT, fg="#0000CC", bg=MASTER_BG_COLOUR)
        blueSliderLabel.grid(row = 4, column = 2, sticky = "W")
        whiteSliderLabel = tk.Label(self, text="W:", font=LED_SLIDER_FONT, fg="#CCCCCC", bg=MASTER_BG_COLOUR)
        whiteSliderLabel.grid(row = 5, column = 2, sticky = "W")


        self.programButton = tk.Button(self, text="Program", font=LED_SWITCH_FONT, command=self.programEnable,
                                       bg = LED_SWITCH_NORMAL_COLOUR)
        self.programButton.grid(row = 1, column = 0, columnspan = 2, sticky ="NESW")

        self.sliderButton = tk.Button(self, text="Slider", font=LED_SWITCH_FONT, command=self.sliderEnable,
                                          bg = LED_SWITCH_NORMAL_COLOUR)
        self.sliderButton.grid(row = 1, column = 3, columnspan = 2, sticky = "NESW")

        self.ledPowerButton = tk.Button(self, text="Slider", font=LED_SWITCH_FONT, command=self.ledPower,
                                          bg = "#B3B3B3")
        self.ledPowerButton.grid(row = 1, column = 2, columnspan = 1, sticky = "NESW")
        
        ##end of led slider section##
        self.ledPower();

    def startProgramRGBW(self, program):
        self.progButton1["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton1["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton2["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton2["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton3["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton3["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton4["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton4["fg"] = LED_PROG_NORMAL_FG_COLOUR

        self.progButton5["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton5["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton6["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton6["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton7["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton7["fg"] = LED_PROG_NORMAL_FG_COLOUR
        self.progButton8["bg"] = LED_PROG_NORMAL_BG_COLOUR
        self.progButton8["fg"] = LED_PROG_NORMAL_FG_COLOUR

        if(program == 1):
            self.progButton1["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton1["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 2):
            self.progButton2["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton2["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 3):
            self.progButton3["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton3["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 4):
            self.progButton4["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton4["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 5):
            self.progButton5["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton5["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 6):
            self.progButton6["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton6["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 7):
            self.progButton7["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton7["fg"] = LED_PROG_ACTIVE_FG_COLOUR
        elif(program == 8):
            self.progButton8["bg"] = LED_PROG_ACTIVE_BG_COLOUR
            self.progButton8["fg"] = LED_PROG_ACTIVE_FG_COLOUR
            
        #serLED.write(str(program))
        global progState
        progState = program

    def updateValueFromSliderRGBW(self, cont):
        global rgbwSliderValue
        redSliderValue = self.redSlider.get()
        greenSliderValue = self.greenSlider.get()
        blueSliderValue = self.blueSlider.get()
        whiteSliderValue = self.whiteSlider.get()

        redSliderColour = "#%02x%02x%02x" % (redSliderValue, 0, 0)
        self.redSlider["troughcolor"] = redSliderColour
        greenSliderColour = "#%02x%02x%02x" % (0, greenSliderValue, 0)
        self.greenSlider["troughcolor"] = greenSliderColour
        greenSliderColour = "#%02x%02x%02x" % (0, greenSliderValue, 0)
        self.greenSlider["troughcolor"] = greenSliderColour
        blueSliderColour = "#%02x%02x%02x" % (0, 0, blueSliderValue)
        self.blueSlider["troughcolor"] = blueSliderColour
        whiteSliderColour = "#%02x%02x%02x" % (whiteSliderValue, whiteSliderValue, whiteSliderValue)
        self.whiteSlider["troughcolor"] = whiteSliderColour

        rgbwSliderValue = "#%02x%02x%02x%02x" % (redSliderValue, greenSliderValue, blueSliderValue, whiteSliderValue)
        #serLED.write(str(rgbwSliderValue))

        

    def sliderEnable(self):
        global rgbwSliderValue
        self.progButton1.config(state="disabled")
        self.progButton2.config(state="disabled")
        self.progButton3.config(state="disabled")
        self.progButton4.config(state="disabled")
        self.progButton5.config(state="disabled")
        self.progButton6.config(state="disabled")
        self.progButton7.config(state="disabled")
        self.progButton8.config(state="disabled")
        self.redSlider.config(state="normal")
        self.greenSlider.config(state="normal")
        self.blueSlider.config(state="normal")
        self.whiteSlider.config(state="normal")
        self.programButton["bg"] = LED_SWITCH_NORMAL_COLOUR
        self.sliderButton["bg"] = LED_SWITCH_ACTIVE_COLOUR
        self.ledPowerButton["bg"] = "#B3B300"
        self.ledPowerButton["text"] = "LED ON"
        #serLED.write(str(rgbwSliderValue))

    def programEnable(self):
        global progState
        self.progButton1.config(state="normal")
        self.progButton2.config(state="normal")
        self.progButton3.config(state="normal")
        self.progButton4.config(state="normal")
        self.progButton5.config(state="normal")
        self.progButton6.config(state="normal")
        self.progButton7.config(state="normal")
        self.progButton8.config(state="normal")
        self.redSlider.config(state="disabled")
        self.greenSlider.config(state="disabled")
        self.blueSlider.config(state="disabled")
        self.whiteSlider.config(state="disabled")
        self.programButton["bg"] = LED_SWITCH_ACTIVE_COLOUR
        self.sliderButton["bg"] = LED_SWITCH_NORMAL_COLOUR
        self.ledPowerButton["bg"] = "#B3B300"
        self.ledPowerButton["text"] = "LED ON"
        #serLED.write(str(progState))

    def ledPower(self):
        self.progButton1.config(state="disabled")
        self.progButton2.config(state="disabled")
        self.progButton3.config(state="disabled")
        self.progButton4.config(state="disabled")
        self.progButton5.config(state="disabled")
        self.progButton6.config(state="disabled")
        self.progButton7.config(state="disabled")
        self.progButton8.config(state="disabled")
        self.redSlider.config(state="disabled")
        self.greenSlider.config(state="disabled")
        self.blueSlider.config(state="disabled")
        self.whiteSlider.config(state="disabled")
        self.programButton["bg"] = LED_SWITCH_NORMAL_COLOUR
        self.sliderButton["bg"] = LED_SWITCH_NORMAL_COLOUR
        self.ledPowerButton["bg"] = "#B3B3B3"
        self.ledPowerButton["text"] = "LED OFF"
        #serLED.write("0")
        




def exitProgram():
        print("Exit Button pressed")
        GPIO.cleanup()
        #serLED.write("0")
        app.destroy()
        app.quit()

#if __name__ == "__main__":
app = pcControlSystem()
app.geometry('800x480')

#multiprocessing.Process(name = 'temperature_page_thread', target = animate )#.start()
#getTempAndFanStats_thread = Process(name = 'get_temperature_thread', target = getTempAndFanStats).start()
getTempAndFanStats_thread = Thread(name = 'get_temperature_and_fan_thread', target = getTempAndFanStats).start()
logTempAndFanStats_thread = Thread(name = 'log_temperature_and_fan_thread', target = logTempAndFanStats).start()

#getTempAndFanStats_thread.start()
ani = animation.FuncAnimation(f, animate_thread, interval = 2000, blit = False)

app.mainloop()

#if __name__ == "__main__":
#    ani = animation.FuncAnimation(f, animate_thread, interval = 2000, blit = False)
#    getTempAndFanStats_thread = Process(name = 'get_temperature_thread', target = getTempAndFanStats)
#    getTempAndFanStats_thread.start()
#    getTempAndFanStats_thread.join()
#    sys.stdout.flush()
#    time.sleep(1)

