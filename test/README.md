# Test

This directory contains python script to serve static content in public directory.
The content in public directory can be used to test the functionality of the validator.

# Tests

## catalog-000

[Link](http://localhost:9090/catalog-000.jsonld)
Valid but empty catalog.
Should pass all test except SHACL.

## catalog-001

[Link](http://localhost:9090/catalog-001.jsonld)
Catalog without datasets and with missing czech title and description.

## catalog-002

[Link](http://localhost:9090/catalog-002.jsonld)
Catalog without datasets and with missing czech title and description and publisher.
The publisher also cause invalid json-schema.

## catalog-003

[Link](http://localhost:9090/catalog-003.jsonld)
Valid catalog with various datasets.
