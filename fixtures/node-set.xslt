<?xml version="1.0"?>
<xsl:transform version="1.0"
	xmlns:exslt="http://exslt.org/common"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	exclude-result-prefixes="exslt">
	
	<xsl:output method='html' indent='yes'/>
	<!--
	<xsl:param name="nodes" />
	-->
    <xsl:template match="/">
		<div id="myDiv">
			<xsl:choose>
				<xsl:when test="function-available('exslt:node-set')">
					<foo />
				</xsl:when>
				<xsl:otherwise>
					<bar />
				</xsl:otherwise>
			</xsl:choose>
		</div>
    </xsl:template>

	<!--
	<xsl:template match="node">
		<a href="{@ref}"><xsl:value-of select="." /></a>
	</xsl:template>	
	-->

</xsl:transform>