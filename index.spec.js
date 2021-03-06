const should    = require('should');
const validator = require('./index');

it('should return the strings for the virtual system information that is in the vendor mappings', function () {
    const vendor_info = validator('Red Hat', 'Red Hat Enterprise Linux', 'KVM', 'SeaBIOS');

    vendor_info.manufacturer.should.equal('Red Hat');
    vendor_info.family.should.equal('Red Hat Enterprise Linux');
    vendor_info.product_name.should.equal('KVM');
    vendor_info.type.should.equal('Virtual');
});

it('should return the string for the physical system that is in the vendor mappings', function () {
    const vendor_info = validator('HP', 'ProLiant', 'ProLiant DL160 Gen9', 'HP');

    vendor_info.manufacturer.should.equal('HP');
    vendor_info.family.should.equal('ProLiant');
    vendor_info.product_name.should.equal('ProLiant DL160 Gen9');
    vendor_info.type.should.equal('Physical');
});

it('should only return the manufacturer when the manufactuer, product, and family are equal and the family and product are not listed in the mappings', function () {
    const vendor_info = validator('OEM', 'OEM', 'OEM', null);

    vendor_info.manufacturer.should.equal('OEM');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.type.should.equal('Unknown');
});

it('should only return the manufacturer when the manufactuer and product are equal and the product is not listed in the mappings', function () {
    const vendor_info = validator('Bochs', '', 'Bochs', 'Bochs');

    vendor_info.manufacturer.should.equal('Bochs');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.type.should.equal('Virtual');
});

it('should only return the product when the manufactuer and product are equal and the manufacturer is not listed in the mappings', function () {
    const vendor_info = validator('Virtual Machine', '', 'Virtual Machine');

    vendor_info.manufacturer.should.equal('Unknown');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Virtual Machine');
    vendor_info.type.should.equal('Virtual');
});

it('should only return the product when the family and product are equal and the product is listed in the mappings', function () {
    const vendor_info = validator('Microsoft Corporation', 'Virtual Machine', 'Virtual Machine', 'Microsoft Corporation');

    vendor_info.manufacturer.should.equal('Microsoft Corporation');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Virtual Machine');
    vendor_info.type.should.equal('Virtual');
});

it('should return unknown when a manufacturer, product, or family is a blacklist string', function () {
    const vendor_info = validator('System Manufacturer', 'To be filled by O.E.M.', 'System Product Name', 'American Megatrends Inc.');

    vendor_info.manufacturer.should.equal('Unknown');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Unknown');
    vendor_info.type.should.equal('Unknown');
});

it('should return the given category when a manufacturer, product, and/or family is not listed in the mappings', function () {
    const vendor_info = validator('NewManufacturer', 'newFamily', 'NewProDuct', null);

    vendor_info.manufacturer.should.equal('NewManufacturer');
    vendor_info.family.should.equal('newFamily');
    vendor_info.product_name.should.equal('NewProDuct');
    vendor_info.type.should.equal('Unknown');
});

it('should return the corrected string for manufacturers, products, and/or families in the graylist', function () {
    let vendor_info = validator('Arrmstrong Data technologies', 'LR-MAAS', 'LabRat MAAS', null);

    vendor_info.manufacturer.should.equal('Armstrong Data Technologies');
    vendor_info.family.should.equal('LR-MAAS');
    vendor_info.product_name.should.equal('LabRat MAAS');
    vendor_info.type.should.equal('Physical');

    vendor_info = validator('Hewlett-Packard', 'ProLiant', 'ProLiant DL160 Gen9', 'HP');
    vendor_info.manufacturer.should.equal('HP');
    vendor_info.family.should.equal('ProLiant');
    vendor_info.product_name.should.equal('ProLiant DL160 Gen9');
    vendor_info.type.should.equal('Physical');
});

it('should return a virtual system with the given data', function () {
    let vendor_info = validator('QEMU', '', 'Standard PC (i440FX + PIIX, 1996)', 'SeaBIOS');

    vendor_info.manufacturer.should.equal('QEMU');
    vendor_info.family.should.equal('Unknown');
    vendor_info.product_name.should.equal('Standard PC (i440FX + PIIX, 1996)');
    vendor_info.type.should.equal('Virtual');
});
