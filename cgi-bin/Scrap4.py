#!/usr/bin/python
# -*- coding: UTF-8 -*-

#count=0
uno='Cazzo CUlo, Not Bli'
due='Blublu Not On Label ,Babu'
tre='Abli Vito On Gay Label'
sub='Not On Label'
sub2=","

if uno.find(sub)>0:
	print "c'è in uno"
if due.find(sub)>0:
	print "c'è in due"
if tre.find(sub)>0:
	print "c'è in tre"


print uno.split(",")[0]
print due.split(",")[0]
print tre.split(",")[0]


	