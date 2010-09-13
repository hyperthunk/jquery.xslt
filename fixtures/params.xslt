<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:output method='html' indent='yes'/>
	<xsl:param name="param1" />
	<xsl:param name="param2" />

    <xsl:template match="/">
        <div>
			<div id="{$param1}">
	            <p><xsl:value-of select="$param2" /></p>
	        </div>
		</div>
    </xsl:template>

</xsl:transform>