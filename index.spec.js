const should    = require('should');
const validator = require('./index');

it('should return the strings for the virtual system information that is in the vendor mappings', function () {
    const vendor_info = validator.validateVendorInformation('Red Hat', 'Red Hat Enterprise Linux', 'KVM');

    vendor_info.manufacturer.should.equal('Red Hat');
    vendor_info.family.should.equal('Red Hat Enterprise Linux');
    vendor_info.product_name.should.equal('KVM');
    vendor_info.isVirtual.should.be.true();
});

it('should return the string for the physical system that is in the vendor mappings', function () {
    const vendor_info = validator.validateVendorInformation('HP', 'ProLiant', 'ProLiant DL160 Gen9');

    vendor_info.manufacturer.should.equal('HP');
    vendor_info.family.should.equal('ProLiant');
    vendor_info.product_name.should.equal('ProLiant DL160 Gen9');
    vendor_info.isVirtual.should.be.false();
});

it('should return the string for the physical system that is in the vendor mappings', function () {
    const vendor_info = validator.validateVendorInformation('HP', 'ProLiant', 'ProLiant DL160 Gen9');

    vendor_info.manufacturer.should.equal('HP');
    vendor_info.family.should.equal('ProLiant');
    vendor_info.product_name.should.equal('ProLiant DL160 Gen9');
    vendor_info.isVirtual.should.be.false();
});

it('should only return the manufacturer when the manufactuer, product, and family are equal and the family and product are not listed in the mappings', function () {
    const vendor_info = validator.validateVendorInformation('OEM', 'OEM', 'OEM');

    vendor_info.manufacturer.should.equal('OEM');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.isVirtual.should.be.false();
});

it('should only return the manufacturer when the manufactuer and product are equal and the product is not listed in the mappings', function () {
    const vendor_info = validator.validateVendorInformation('Bochs', '', 'Bochs');

    vendor_info.manufacturer.should.equal('Bochs');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.isVirtual.should.be.true();
});

it('should only return the product when the manufactuer and product are equal and the manufacturer is not listed in the mappings', function () {
    const vendor_info = validator.validateVendorInformation('Virtual Machine', '', 'Virtual Machine');

    vendor_info.manufacturer.should.equal('Unknown');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Virtual Machine');
    vendor_info.isVirtual.should.be.false();
});

it('should only return the product when the family and product are equal and the product is listed in the mappings', function () {
    const vendor_info = validator.validateVendorInformation('Microsoft', 'Virtual Machine', 'Virtual Machine');

    vendor_info.manufacturer.should.equal('Microsoft');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Virtual Machine');
    vendor_info.isVirtual.should.be.false();
});

it('should return unknown when a manufacturer, product, or family is a blacklist string', function () {
    const vendor_info = validator.validateVendorInformation('System Manufacturer', 'To be filled by O.E.M.', 'System Product Name');

    vendor_info.manufacturer.should.equal('Unknown');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.isVirtual.should.be.false();
});

it('should return the given category when a manufacturer, product, and/or family is not list in the mappings', function () {
    const vendor_info = validator.validateVendorInformation('NewManufacturer', 'newFamily', 'NewProDuct');

    vendor_info.manufacturer.should.equal('NewManufacturer');
    vendor_info.family.should.equal('newFamily');
    vendor_info.product_name.should.equal('NewProDuct');
    vendor_info.isVirtual.should.be.false();
});

it('should return the corrected string for manufacturers, products, and/or families in the graylist', function () {
    let vendor_info = validator.validateVendorInformation('Arrmstrong Data technologies', 'LR-MAAS', 'LabRat MAAS');

    vendor_info.manufacturer.should.equal('Armstrong Data Technologies');
    vendor_info.family.should.equal('LR-MAAS');
    vendor_info.product_name.should.equal('LabRat MAAS');
    vendor_info.isVirtual.should.be.false();

    vendor_info = validator.validateVendorInformation('Hewlett-Packard', 'ProLiant', 'ProLiant DL160 Gen9');
    vendor_info.manufacturer.should.equal('HP');
    vendor_info.family.should.equal('ProLiant');
    vendor_info.product_name.should.equal('ProLiant DL160 Gen9');
    vendor_info.isVirtual.should.be.false();
});
