#!/usr/bin/python
# -*- coding: UTF-8 -*-

#Necessito:  1-Tipo annotazione(user_type)   2-annotatore ("nome-cognome"= user_user)  
# 3-Target(user_link)    4-Annotazione vera e propria(user_ann)   5-DataAnnotazione(user_time)
#6-InizioFrammento(user_start)    7-FineFrammento(user_end)     8-Div(user_div)  9-linkwikipedia (user_extra)

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
DBO = Namespace("http://dbpedia.org/ontology/")

ris = {	'risposta': [] }

rdf = Graph()


form = cgi.FieldStorage() 
tipo = form.getvalue('user_type') 

user=form.getvalue('user_user')
nick=user.replace (" ", "-")
nick=nick.replace (".", "-")
nick=nick.lower()
nick = "http://vitali.web.cs.unibo.it/AnnOtaria/person/" + nick


link = form.getvalue('user_link')
linkver=link.split("documents/")[1]
linkver= "http://vitali.web.cs.unibo.it/AnnOtaria/"  + linkver
value = form.getvalue('user_div')
start = form.getvalue('user_start')
end = form.getvalue('user_end')
subject = linkver + "#" + value + "-" + start + "-" + end






if (tipo == "denotesPerson"):
	person=form.getvalue('user_ann')
	person_nick=person.replace (" ", "-")
	person_nick=person_nick.replace (".", "-")
	person_nick=person_nick.lower()
	person_nick = "http://vitali.web.cs.unibo.it/AnnOtaria/person/" + person_nick
	wiki =form.getvalue('user_extra')
	wiki=wiki.split("wiki/")[1]
	dbp = "http://dbpedia.org/resource/"  + wiki
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("denotesPerson")))
	rdf.add((ann,RDFS.label,Literal("Persona")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SEM.denotes))
	rdf.add((body,RDFS.label,Literal(form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,URIRef(person_nick)))
	rdf.add((body,RDF.resource,URIRef( dbp)))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

	rdf.add((URIRef(person_nick ),RDF.type,FOAF.Person))
	rdf.add((URIRef(person_nick),FOAF.name, Literal( form.getvalue('user_ann') )))

elif (tipo == "denotesPlace" ):	
	wiki =form.getvalue('user_ann')
	wiki=wiki.split("wiki/")[1]
	dbp = "http://dbpedia.org/resource/"  + wiki
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("denotesPlace")))
	rdf.add((ann,RDFS.label,Literal("Luogo")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SEM.denotes))
	rdf.add((body,RDFS.label,Literal(wiki)))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,URIRef( dbp)))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

	rdf.add((URIRef(dbp),RDF.type,DBO.Place))
	rdf.add((URIRef(dbp),RDFS.label,Literal(wiki)))

elif (tipo == "denotesDisease" ):	
	icdlink =form.getvalue('user_extra')
	
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("denotesDisease")))
	rdf.add((ann,RDFS.label,Literal("Malattia")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SEM.denotes))
	rdf.add((body,RDFS.label,Literal(form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,URIRef( icdlink )))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

	rdf.add((URIRef(icdlink),RDF.type,SKOS.concept))
	rdf.add((URIRef(icdlink),RDFS.label,Literal(form.getvalue('user_ann'))))

elif (tipo == "hasSubject" ):	
	soggettario = "http://thes.bncf.firenze.sbn.it/" + form.getvalue("user_ann")
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasSubject")))
	rdf.add((ann,RDFS.label,Literal("Argomento Principale")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,FABIO.hasSubjectTerm))
	rdf.add((body,RDFS.label,Literal(form.getvalue('user_ann'))))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,URIRef( soggettario )))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

	rdf.add((URIRef(soggettario),RDF.type,SKOS.concept))
	rdf.add((URIRef(soggettario),RDFS.label,Literal(form.getvalue('user_ann'))))

elif (tipo == "relatesTo" ):	
	wiki =form.getvalue('user_ann')
	wiki=wiki.split("wiki/")[1]
	dbp = "http://dbpedia.org/resource/"  + wiki
	wiki=wiki.replace ("_", " ")
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("relatesTo")))
	rdf.add((ann,RDFS.label,Literal("Risorsa DBPedia")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SKOS.related))
	rdf.add((body,RDFS.label,Literal( wiki )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,URIRef( dbp)))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger ))
)
	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasClarityScore" ):	
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasClarityScore")))
	rdf.add((ann,RDFS.label,Literal("Chiarezza")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,AO.hasClaritiyScore))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,Literal(form.getvalue('user_ann'))))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasOriginalityScore" ):
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasOriginalityScore")))
	rdf.add((ann,RDFS.label,Literal("Originalità")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,AO.hasOriginalityScore))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,Literal(form.getvalue('user_ann'))))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasFormattingScore" ):
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasFormattingScore")))
	rdf.add((ann,RDFS.label,Literal("Presentazione")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,AO.hasFormattingScore))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,Literal(form.getvalue('user_ann'))))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "cites" ):	
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("cites")))
	rdf.add((ann,RDFS.label,Literal("Citazione")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,CITO.cites))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,Literal(form.getvalue('user_ann'))))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

	rdf.add((URIRef(nick),RDF.type,FOAF.Person))
	rdf.add((URIRef(nick),SCHEMA.email, Literal(form.getvalue('user_mail'))))
	rdf.add((URIRef(nick),FOAF.name, Literal( user )))

elif (tipo == "hasComment" ):	
	ann = BNode()
	body = BNode()
	target = BNode()
	selector = BNode()

	rdf.add((ann,RDF.type,OA.Annotation))
	rdf.add((ann,AO.type,Literal("hasComment")))
	rdf.add((ann,RDFS.label,Literal("Commento Personale")))
	rdf.add((ann,OA.annotatedAt,Literal(form.getvalue('user_time'))))
	rdf.add((ann,OA.hasTarget, target ))
	rdf.add((ann,OA.annotatedBy,URIRef( nick )))
	rdf.add((ann,OA.hasBody, body ))

	rdf.add((body,RDF.type,RDF.Statement))
	rdf.add((body,RDF.predicate,SCHEMA.comment))
	rdf.add((body,RDFS.label,Literal( form.getvalue('user_ann') )))
	rdf.add((body,RDF.subject,URIRef( subject )))
	rdf.add((body,RDF.object,Literal( form.getvalue('user_ann'), datatype=XSD.string )))

	rdf.add ((target,RDF.type,OA.SpecificResource))
	rdf.add ((target,OA.hasSelector, selector))
	rdf.add ((target,OA.hasSource, URIRef( linkver )))

	rdf.add ((selector,RDF.type,OA.FragmentSelector))
	rdf.add ((selector,RDF.value,Literal( value  )))
	rdf.add ((selector,OA.end,Literal( end , datatype=XSD.nonNegativeInteger )))
	rdf.add ((selector,OA.start,Literal( start , datatype=XSD.nonNegativeInteger )))

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





	



