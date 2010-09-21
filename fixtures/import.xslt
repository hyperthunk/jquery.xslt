<?xml version="1.0"?>
<xsl:transform version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:import href="fixtures/common.xslt" />
	<xsl:import href="fixtures/worm.xslt" />

	<xsl:output method='xml'
				indent='yes'
				omit-xml-declaration="yes"/>

    <xsl:template match="/">
		<xsl:choice>
            <xsl:when test="@test-imports">
                <xsl:apply-imports select="." />
            </xsl:when>
            <xsl:otherwise>
                <output>
                    <xsl:call-template name="foobar" />
                    <xsl:call-template name="bookworm"/>
                </output>
            </xsl:otherwise>
        </xsl:choice>
    </xsl:template>

    <xsl:template match="override">
        <overridden />
    </xsl:template>

</xsl:transform>
