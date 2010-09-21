<?xml version="1.0"?>
<xsl:transform version="1.0"
	xmlns:exslt="http://exslt.org/common"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	exclude-result-prefixes="exslt">

	<xsl:output method='xml' indent='yes'/>

    <xsl:template match="/">
        <xsl:copy-of select="exslt:node-set(document('fixtures/books.xml'))" />
    </xsl:template>

</xsl:transform>
