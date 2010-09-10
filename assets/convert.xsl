<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	exclude-result-prefixes="xsd"
	xmlns="http://collaborate.bt.com/sdkrepo/schemas/2010/09">

 	<xsl:output method="xml" indent="no" /> 
	<xsl:strip-space elements="*" />

	<xsl:template match="/">
		<xsl:apply-templates select="child::*" />
	</xsl:template>
	
	<xsl:template match="name">
		<name><xsl:value-of select="concat(text(), '2')" /></name>
	</xsl:template>
	
	<xsl:template match="providers|consumers">
		<!-- stripped -->
	</xsl:template>
	
	<xsl:template match="*[count(child::*) &gt; 1]">
		<xsl:element name="{string(name(.))}">
			<xsl:copy-of select="attribute::*[not(contains(name(), 'jpaId'))]" />
			<xsl:apply-templates select="child::*" />
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="*[count(child::text()) = 1]">
		<xsl:element name="{string(name(.))}">
			<xsl:copy-of select="attribute::*[not(contains(name(), 'jpaId'))]" />
			<xsl:value-of select="text()" />
		</xsl:element>
	</xsl:template>
	
</xsl:transform>