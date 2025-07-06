import { expect, describe, it } from "vitest"
import { GuestDTO } from "../src/types"

describe("core tests", () => {
    it('should run', () => {
        const True = true;
        expect(True).toBe(true);
    })

    it('should include phoneCountryCode in GuestDTO', () => {
        const guestData: GuestDTO = {
            name: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            phoneCountryCode: "+1",
            message: "Test message",
            confirmed: false
        };

        expect(guestData).toHaveProperty('phoneCountryCode');
        expect(guestData.phoneCountryCode).toBe('+1');
        expect(guestData.phone).toBe('1234567890');
    })
})