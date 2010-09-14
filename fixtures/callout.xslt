<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
			 
	<xsl:include href="fixtures/common.xslt" />
	<xsl:include href="fixtures/worm.xslt" />
	
	<xsl:output method='xml' 
				indent='yes'
				omit-xml-declaration="yes"/>

    <xsl:template match="/">
		<output>
			<xsl:call-template name="foobar" />
			<xsl:call-template name="bookworm"/> 
		</output>
    </xsl:template>

</xsl:transform>