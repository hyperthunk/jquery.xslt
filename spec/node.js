
require.paths.unshift('spec', './spec/lib', 'lib')
require('jspec')
require('unit/spec.helper')
require('jquery.xslt')

JSpec
  .exec('spec/unit/spec.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
