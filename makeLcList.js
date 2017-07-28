const fs = require('fs');
const vendor_mappings = require('./vendor_mappings.json');

const lcBL = vendor_mappings.blacklist.map(function(item) {
    return item.toLowerCase();
});
const virtual = vendor_mappings.product_names['virtual'].map(function(item) {
    return item.toLowerCase();
});
const physical = vendor_mappings.product_names['physical'].map(function(item) {
    return item.toLowerCase();
});
const lcFamilies = vendor_mappings.families.map(function(item) {
    return item.toLowerCase();
});
const lcManufacturersVirt = vendor_mappings.manufacturers.virtual.map(function(item) {
    return item.toLowerCase();
});
const lcManufacturers = vendor_mappings.manufacturers.other.map(function(item) {
    return item.toLowerCase();
});
const obj = {
    blacklist: lcBL,
    product_names: {
        virtual: virtual,
        physical: physical
    },
    graylist: vendor_mappings.graylist,
    families: lcFamilies,
    manufacturers: {
        virtual: lcManufacturersVirt,
        other: lcManufacturers
    }
}

fs.writeFile('./lc_vendor_mappings.json', JSON.stringify(obj, null, '    '), 'utf8', function (err) {
    if (err) console.log(err);

    console.log('data successfully written to lc_vendor_mappings.json')
});
