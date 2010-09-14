<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
			 
	<xsl:include href="fixtures/common.xslt" />
	
	<xsl:output method='xml' 
				indent='yes'
				omit-xml-declaration="yes"/>

    <xsl:template match="/">
		<!--
		<xsl:copy-of select="document('input.xml')" />
		-->
		<output>
			<xsl:call-template name="foobar" />
		</output>
    </xsl:template>

</xsl:transform>