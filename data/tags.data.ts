import { faker } from '@faker-js/faker';
import { TAGS } from '../constants/tags.constant';
import { getRandomData } from '../utils/funtionHelper';
import { getTagColor } from '../services/product/tags/tagColor.api';

export async function tagsDataValid() {
    const typeRandom = [TAGS.TAG_PRODUCT, TAGS.TAG_CUSTOMER, TAGS.TAG_ORDER, TAGS.TAG_SUPPLIER];
    const tagColorsResponse = await getTagColor();
    const tagColorIds = getRandomData(tagColorsResponse.data, 1, 'id');
    return {
        name: faker.color.human(),
        type: typeRandom[Math.floor(Math.random() * typeRandom.length)],
        tagColorId: tagColorIds[0]
    }
}