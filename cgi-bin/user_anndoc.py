#!/usr/bin/python
# -*- coding: UTF-8 -*-

#Necessito:  1-Tipo annotazione(user_type)   2-annotatore ("Nome Cognome"= user_user)  
# 3-Target(user_link)    4-Annotazione vera e propria(user_ann)   5-DataAnnotazione(user_time)
#6 : user_extra per (hasPublisher)= sito casa editrice


import sys
#~ sys.path.append("/home/web/ltw1416/cgi-bin/rdflib-4.2_dev-py2.7.egg/")
sys.path[0:0] = ['/home/web/ltw1416/cgi-bin/src/rdflib-4.2_dev-py2.7.egg/']
sys.path[0:0] = ['/home/web/ltw1416/cgi-bin/src/six-1.7.3-py2.7.egg/']
sys.path[0:0] = ['/home/web/ltw1416/cgi-bin/src/isodate-0.5.1_dev-py2.7.egg/']
sys.path[0:0] = ['/home/web/ltw1416/cgi-bin/src/isodate-0.5.0-py2.7.egg/']
sys.path[0:0] = ['/home/web/ltw1416/cgi-bin/src/html5lib-1.0b3-py2.7.egg/']
import cgi, cgitb, json
from rdflib import Namespace, Literal, BNode, Graph, URIRef, ConjunctiveGraph
from rdflib.namespace import XSD

FOAF = Namespace("http://xmlns.com/foaf/0.1/")
OA = Namespace("http://www.w3.org/ns/oa#")
FABIO = Namespace("http://purl.org/spar/fabio/") 
AO = Namespace("http://vitali.web.cs.unibo.it/AnnOtaria/") 
AOP = Namespace("http://vitali.web.cs.unibo.it/AnnOtaria/person/") 
DCTERMS = Namespace("http://purl.org/dc/terms/") 
RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#") 
SCHEMA = Namespace("http://schema.org/") 
DBPEDIA = Namespace("http://dbpedia.org/ontology/") 
SKOS = Namespace("http://www.w3.org/2004/02/skos/core#") 
SEM = Namespace("http://semanticweb.cs.vu.nl/2009/11/sem/") 
CITO = Namespace("http://purl.org/spar/cito/")
XSD = Namespace("http://www.w3.org/2001/XMLSchema#")
RDF = Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")

ris = {	'risposta': [] }


rdf = Graph()

form = cgi.FieldStorage() 
tipo = form.getvalue('user_type') 

link = form.getvalue('user_link') 
linkver=link.split("documents/")[1]
linkver= "http://vitali.web.cs.unibo.it/AnnOtaria/"  + linkver

user=form.getvalue('user_user')
nick=user.replace (" ", "-")
nick=nick.replace (".", "-")
nick=nick.lower()
nick = "http://vitali.web.cs.unibo.it/AnnOtaria/person/" + nick
sitoeditore=form.getvalue('user_extra')



if (tipo == "hasAuthor"):
	author=form.getvalue('user_ann')
	author_nick=author.replace (" ", "-")
	author_nick=author_nick.replace (".", "-")
	author_nick=author_nick.lower()
	author_nick = "http://vitali.web.cs.unibo.it/AnnOtaria/person/" + author_nick					
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasAuthor")))
	rdf.add((ann,RDFS.label,Literal("Autore")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,DCTERMS.creator))
	rdf.add((body,RDFS.label,Literal(form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,URIRef(author_nick)))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

	rdf.add((URIRef(author_nick ),RDF.type,FOAF.Person))
	rdf.add((URIRef(author_nick),FOAF.name, Literal( form.getvalue('user_ann') )))

elif (tipo=="hasTitle"):
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasTitle")))
	rdf.add((ann,RDFS.label,Literal("Titolo")))							
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,DCTERMS.title))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( linkver)))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann'), datatype=XSD.string )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo=="hasPublisher"):					
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasPublisher")))
	rdf.add((ann,RDFS.label,Literal("Editore")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,DCTERMS.publisher))
	rdf.add((body,RDFS.label,Literal(form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,URIRef(sitoeditore)))

	rdf.add((URIRef(sitoeditore),RDF.type,FOAF.Organization))
	rdf.add((URIRef(sitoeditore),FOAF.name,Literal(form.getvalue('user_ann'))))
	rdf.add((URIRef(sitoeditore),FOAF.homepage,Literal(sitoeditore)))
	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasPublicationYear" ):
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasPublicationYear")))
	rdf.add((ann,RDFS.label,Literal("PublicationYear")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,FABIO.hasPubliationYear))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann')  )))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann'), datatype=XSD.gYear  )))
	

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasAbstract" ):
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasAbstract")))
	rdf.add((ann,RDFS.label,Literal("Riassunto")))							
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,DCTERMS.abstract))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann') , datatype=XSD.string )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasShortTitle" ):
	form.getvalue('user_ann')
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasShortTitle")))
	rdf.add((ann,RDFS.label,Literal("Titolo breve")))							
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,FABIO.hasShortTitle))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann'), datatype=XSD.string )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasComment" ):
	ann = BNode()
	body = BNode()
	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasComment")))
	rdf.add((ann,RDFS.label,Literal("Commento personale")))							
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget,URIRef( linkver )))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SCHEMA.comment))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( linkver )))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann'), datatype=XSD.string  )))	

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))


giovannaurl = "http://giovanna.cs.unibo.it:8181/data"


giov = ConjunctiveGraph('SPARQLUpdateStore')
giov.open((giovannaurl + "/query", giovannaurl + "/update"))
update = "INSERT DATA { %s }" % rdf.serialize(format="nt")
giov.update(update)
ris['risposta'].append(rdf.serialize(format="turtle"))
ris['risposta'].append("Annotazioni inserite correttamente")	
print 'Content-Type: application/json\n\n'
print json.dumps(ris)
