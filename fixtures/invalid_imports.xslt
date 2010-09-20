<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:include href="no/such/url/ignored.xslt" />

	<xsl:output method='xml'
				indent='yes'
				omit-xml-declaration="yes"/>

    <xsl:template match="*">
        <!-- override the default behaviour -->
    </xsl:template>

</xsl:transform>
