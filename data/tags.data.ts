const faker = require('@faker-js/faker').faker;
import { TAGS } from '../constants/tags.constant';

const typeRandom = [TAGS.TAG_PRODUCT, TAGS.TAG_CUSTOMER, TAGS.TAG_ORDER, TAGS.TAG_SUPPLIER];

export const tagsDataValid = {
    name: faker.company.name(),
    type: typeRandom[Math.floor(Math.random() * typeRandom.length)],
    tagColorId: 0
}