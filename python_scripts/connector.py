__author__ = 'Ido'

import urllib2

'''
Make sure you are connected to the internet before using this class
'''

class Connector:

    STATEValid="URL_Valid"
    STATE404="URL_404"
    STATEError="URL_Unknown_Error"

    ERROR404="HTTPError_404_was_caught(Page_was_not_found)"
    ERRORGeneral="Unkown_Error_was_caught"

    def __init__(self,url):
        self.url=url

    def connect(self):
        html=""
        try:
            connection=urllib2.urlopen(self.url)
            html=connection.read()
            connection.close()
        except urllib2.HTTPError, err:
            if err.code == 404:
                html=Connector.ERROR404
        except:
            html=Connector.ERRORGeneral


        self.html=html


    def checkState(self):
        self.connect()
        state=""
        if self.html==Connector.ERROR404:
            state=Connector.STATE404
        elif self.html==Connector.ERRORGeneral:
            state=Connector.STATEError
        else:
            state=Connector.STATEValid

        self.state=state

    def getHtml(self):
        self.connect()
        return self.html

    def getState(self):
        self.checkState()
        return self.state

    def __str__(self):
        return "A Connector for URL: "+self.url