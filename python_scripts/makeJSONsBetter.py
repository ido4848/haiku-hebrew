__author__ = 'Ido'

import json
import connector

def makeDataStringy(file):
    with open(file) as data_file:
        data = json.load(data_file)
    for unit in data:
        if 'id' in unit:
            unit['id']=str(unit['id'])
        unit['info']['h']=str(unit['info']['h'])
        unit['info']['w']=str(unit['info']['w'])
    print data
    with open(file, "w") as outfile:
        json.dump(data,outfile)

def deleteNotValid(file,newFile):
    with open(file) as data_file:
        data = json.load(data_file)
    newData=[]
    for unit in data:
        if 'state' in unit:
            if unit['state']==connector.Connector.STATEValid:
                newData.append(unit)
    print newData
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile)

def mergeJSONs(file1,file2,newFile):
    with open(file1) as data_file:
        data1 = json.load(data_file)
    with open(file2) as data_file:
        data2 = json.load(data_file)
    newData=data1
    for unit in data2:
        newData.append(unit)
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile)

def mergeJSONs(files,newFile):
    newData=[]
    for currFile in files:
        with open(currFile) as data_file:
            currData = json.load(data_file)
        for unit in currData:
            newData.append(unit)
    newData=byteify(newData)        
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile,ensure_ascii=False)


def deleteUnitsFromJSON(file,newFile,s,e):
    with open(file) as data_file:
        data = json.load(data_file)
    newData=[]
    for unit in data:
        id=int(unit['id'])
        if id<s or id>e:
            newData.append(unit)
    if len(newData)<1000:
        return
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile)

def deleteZeroUnitsFromJSON(file,newFile):
    with open(file) as data_file:
        data = json.load(data_file)
    newData=[]
    for unit in data:
        info=unit['info']
        h=int(info['h'])
        w=int(info['w'])
        if w!=0 and h!=0:
            newData.append(unit)
        else:
            print unit
    if len(newData)<1000:
        return
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile)

def byteify(input):
    if isinstance(input, dict):
        return {byteify(key):byteify(value) for key,value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

def deleteDuplicatesFromJSON(file,newFile):
    with open(file) as data_file:
        data = json.load(data_file)
    newData = { each['word'] : each for each in data }.values()
    newData=byteify(newData)
    with open(newFile, "w") as outfile:
        json.dump(newData,outfile,ensure_ascii=False)


'''
files=["../words/add-shems1-no-dups.json","../words/add-shems2-no-dups.json","../words/add-shems3-no-dups.json","../words/add-shems4-no-dups.json"]
newFile="../words/add-shems-total.json"
mergeJSONs(files,newFile)
'''


file1="../words/shems2-dups.json"
file2="../words/shems2.json"

deleteDuplicatesFromJSON(file1,file2)
'''

files=["../words/add-shems-total-no-dups.json","../words/shems.json"]
newFile="../words/shems2-dups.json"
mergeJSONs(files,newFile)
'''