__author__ = 'Ido'

import connector as con
import gui

url="http://tinyurl.com/randheb"
conUrl=con.Connector(url)
html=conUrl.getHtml()
print "html",html
gui.displayText(html,40,150)