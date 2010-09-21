<?xml version="1.0"?>
<xsl:transform version="1.0"
	xmlns:exslt="http://exslt.org/common"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	exclude-result-prefixes="exslt">

	<xsl:output method='xml'
				indent='yes'
				omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <div>
            <xsl:apply-templates select="exslt:node-set(document('fixtures/input.xml'))/books/book" />
        </div>
    </xsl:template>

    <xsl:template match="book">
        <p><xsl:value-of select="@name" /></p>
    </xsl:template>

</xsl:transform>
