<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:output method='html' indent='yes'/>

    <xsl:template match="/">
        <div>
            <xsl:apply-templates select="child::*" />
        </div>
    </xsl:template>

    <xsl:template match="book">
		<p>
			<a href="search/?title={@author}"><xsl:value-of select="@name" /></a>, 
			<em><xsl:value-of select="@author" /></em>
		</p>
    </xsl:template>

</xsl:transform>