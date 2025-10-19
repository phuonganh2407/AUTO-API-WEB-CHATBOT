import { faker } from '@faker-js/faker';
import { TAGS } from '../constants/tags.constant';
import { getRandomData, getSubObjectByKeys } from '../utils/funtionHelper';
import { getTagColor } from '../services/product/tags/tagColor.api';
import { createTagBody, editTagBody } from '../object/tag.api.object';
import { getListTag } from '../services/product/tags/tag.api';
import { createRandomString } from '../utils/genFunctionData';


const typeRandom = [TAGS.TAG_PRODUCT, TAGS.TAG_CUSTOMER, TAGS.TAG_ORDER, TAGS.TAG_SUPPLIER];
const tagColorsResponse = await getTagColor();
const tagColorIds = getRandomData(tagColorsResponse.data, 1, 'id');

// Tạo dữ liệu với đầy đủ thông tin hợp lệ
export async function fullTagsData(): Promise<Partial<createTagBody>> {
    return {
        name: `${faker.color.human()}_${Date.now()}`, // Thêm timestamp để đảm bảo unique
        type: typeRandom[Math.floor(Math.random() * typeRandom.length)],
        tagColorId: tagColorIds[0]
    };
}

// Tạo dữ liệu với name rỗng
export async function emptyName(): Promise<Partial<createTagBody>> {
    return { ...await fullTagsData(), name: '' };
}

// Tạo dữ liệu với name đã tồn tại
export async function duplicateName(): Promise<Partial<createTagBody>> {
    const responseListTags = await getListTag({ TagType:  TAGS.TAG_PRODUCT });
    const nameExists = responseListTags.data.items[0]?.name || 'Existing_Tag_Name';
    return { ...await fullTagsData(), name: nameExists, type: TAGS.TAG_PRODUCT  };
}

// Tạo dữ liệu với name dài hơn 25 kí tự
export async function longName(): Promise<Partial<createTagBody>> {
    return { ...await fullTagsData(), name: createRandomString(30) };
}

export async function mapEditData(): Promise<Partial<editTagBody>> {
    const getItemTagRandom = await getListTag({ TagType: typeRandom[Math.floor(Math.random() * typeRandom.length)]});
    const randomTag = getRandomData(getItemTagRandom.data, 1)[0];
    
    // Map trực tiếp từ keys của interface - hoàn toàn tự động
    const mapped = getSubObjectByKeys(randomTag, Object.keys(editTagBody));
    return mapped;
}
