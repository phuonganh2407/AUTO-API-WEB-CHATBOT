import { AuthFlowHelper } from "../../utils/infoAccount.helper";
import { clearSession } from "../../utils/session.helper";

describe("Auth Flow Test", () => {
	beforeAll(() => {
		clearSession();
	});

	test("Case 1: Login and save token", async () => {
		const token = await AuthFlowHelper.loginAndSaveToken();
		console.log("Token saved and verified:", token);
	});
});
