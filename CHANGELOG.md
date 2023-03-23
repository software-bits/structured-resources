# Changelog

All notable changes to this project will be documented here.

## [0.1.3] - 2023-03-23
### Changed
- typing to be backward compatible from typescript version 4.2.x onwards

## [0.1.2] - 2023-03-19

### Changed 
- typing on for() and selectSome() input arguments changed to require at least one resource name without changing expectation on next resource names

## [0.1.1] - 2023-03-19

### Changed 
- removed husky to fix issue when installing package

## [0.1.0] - 2023-03-19

### Added

- Structured Resources class with, 'for', 'all', 'select', 'selectSome', and 'selectAll' methods.
- custom method 'chain' on 'for' and 'all'
