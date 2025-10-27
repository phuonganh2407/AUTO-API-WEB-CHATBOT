import { fakerVI } from "@faker-js/faker";
import { TAGS } from '../../constants/tags.constant';
import { getRandomData, getSubObjectByKeys } from '../../utils/funtionHelper';
import { getTagColor } from '../../services/productApi/tags/tagColor.api';
import { createTagBody, editTagBody } from '../../object/serviceProductObject/tag.api.object';
import { getListTag, createTag } from '../../services/productApi/tags/tag.api';
import { createRandomNumberString, createRandomString } from '../../utils/genFunctionData';


const typeRandom = [TAGS.TAG_PRODUCT, TAGS.TAG_CUSTOMER, TAGS.TAG_ORDER, TAGS.TAG_SUPPLIER];

/**
 *  Tạo dữ liệu với đầy đủ thông tin hợp lệ
 * @returns 
 */
export async function fullTagsData(): Promise<Partial<createTagBody>> {
    const tagColorsResponse = await getTagColor();
    const tagColorIds = getRandomData(tagColorsResponse.data, 1, 'id');
    return {
        name: `${fakerVI.color.human()}_${Date.now()}`, // Thêm timestamp để đảm bảo unique
        type: typeRandom[Math.floor(Math.random() * typeRandom.length)],
        tagColorId: tagColorIds[0]
    };
}

/**
 *  Tạo dữ liệu với name rỗng
 * @returns 
 */
export async function emptyName(): Promise<Partial<createTagBody>> {
    return { ...await fullTagsData(), name: '' };
}

/**
 * Tạo dữ liệu với name đã tồn tại
 * @returns
 */
export async function duplicateName(): Promise<Partial<createTagBody>> {
    const responseListTags = await getListTag({ TagType:  TAGS.TAG_PRODUCT });
    const nameExists = responseListTags.data.items[0]?.name || 'Existing_Tag_Name';
    return { ...await fullTagsData(), name: nameExists, type: TAGS.TAG_PRODUCT  };
}

/**
 *  Tạo dữ liệu với name dài hơn 25 kí tự
 * @returns
 */
export async function longName(): Promise<Partial<createTagBody>> {
    return { ...await fullTagsData(), name: createRandomString(30) };
}

/**
 *  Map dữ liệu chỉnh sửa từ một tag ngẫu nhiên
 * @returns body chỉnh sửa đã map data và id của tag
 */
export async function mapEditData(): Promise<{ payload: Partial<editTagBody>; id: number }> {
    const getItemTagRandom = await getListTag({ TagType: typeRandom[Math.floor(Math.random() * typeRandom.length)]});
    const randomTag = getRandomData(getItemTagRandom.data, 1)[0];
    const idTagEdit = randomTag.id;
    // Map trực tiếp từ keys của interface - những field nào giống nhau sẽ map value từ nhóm khách hàng ngẫu nhiên cho body chỉnh sửa
    const mapped = getSubObjectByKeys(randomTag, Object.keys(editTagBody));
    return { payload: mapped, id: idTagEdit };
}
/**
 *  Tạo dữ liệu chỉnh sửa với tên rỗng
 * @returns body chỉnh sửa đã map data và id của tag kèm theo name rỗng
 */
export async function emptyNameEdit(): Promise<{ payload: Partial<editTagBody>; id: number }> {
    const { payload, id } = await mapEditData();
    return { payload: { ...payload as any, name: '' }, id };
};

/**
 *  Tạo dữ liệu chỉnh sửa với tên rỗng
 * @returns body chỉnh sửa đã map data và id của tag kèm theo name rỗng
 */
export async function longNameEdit(): Promise<{ payload: Partial<editTagBody>; id: number }> {
    const { payload, id } = await mapEditData();
    return { payload: { ...payload as any, name: createRandomString(30) }, id };
};

/**
 *  Tạo dữ liệu chỉnh sửa với tên đã tồn tại
 * @returns body chỉnh sửa đã map data và id của tag kèm theo name đã tồn tại
 */
export async function duplicateNameEdit(): Promise<{ payload: Partial<editTagBody>; id: number }> {
    const responseListTags = await getListTag({ TagType:  TAGS.TAG_PRODUCT });
    const nameExists = responseListTags.data.items[0]?.name;
    const { payload, id } = await mapEditData();
    return { payload: { ...payload as any, name: nameExists }, id };
}

/**
 *  Tạo dữ liệu chỉnh sửa với tên hợp lệ
 * @returns body chỉnh sửa đã map data và id của tag kèm theo name hợp lệ
 */
export async function nameValidEdit(): Promise<{ payload: Partial<editTagBody>; id: number }> {
    const { payload, id } = await mapEditData();
    return { payload: { ...payload as any, name: `${fakerVI.color.human()}_${Date.now()}` }, id };
};

/**
 * Tạo một tag mới và trả về ID để sử dụng cho test xóa
 * @returns ID của tag vừa tạo
 */
export async function createTagForDelete(): Promise<number> {
    const payload = await fullTagsData();
    const createResponse = await createTag(payload as any);
    console.log("Created tag ID for delete test:", createResponse.data.id);
    return createResponse.data.id;
};

/**
 *  Tạo ID không hợp lệ để test
 * @returns 
 */
export async function idTagInvalid(): Promise<number> {
    return Number(createRandomNumberString(10)); // ID không hợp lệ
};