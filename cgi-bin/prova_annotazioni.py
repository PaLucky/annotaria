#!/usr/bin/python
# -*- coding: UTF-8 -*-
#Necessito:  1-Tipo annotazione(user_type)   2-annotatore ("Nome Cognome"= user_user)  
# 3-Target(user_link)    4-Annotazione vera e propria(user_ann)   5-DataAnnotazione(user_time)
import SPARQLWrapper
import rdflib
#sparql = SPARQLWrapper.SPARQLWrapper("http://giovanna.cs.unibo.it:8181/data/update")
sparql = SPARQLWrapper.SPARQLWrapper("http://192.168.1.5:3030/inf/update")
sparql.method= 'POST'
sparql.setQuery("""
PREFIX oa: <http://www.w3.org/ns/oa#> 
PREFIX ao: <http://vitali.web.cs.unibo.it/AnnOtaria/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms:  <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX aop:   <http://vitali.web.cs.unibo.it/AnnOtaria/person/>
DELETE{}
INSERT { [ 	a 	oa:Annotation ;
			rdfs:label "provola";
		].
}
WHERE{}"""
)
ret = sparql.query()