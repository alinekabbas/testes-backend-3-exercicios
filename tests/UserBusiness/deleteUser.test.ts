import { UserBusiness } from "../../src/business/UserBusiness"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("deleteUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deletar usuário", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-admin"
        }
        await userBusiness.deleteUser(input)
    })

    test("deve disparar erro caso 'token' não seja uma 'string'", async () => { 
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: null
            }
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("requer token")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'token' não seja uma válido", async () => { 
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-adm"
            }
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'token' não seja do administrador", async () => { 
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-normal"
            }
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("somente admins podem deletar contas")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'id' não seja encontrado", async () => { 
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id",
                token: "token-mock-admin"
            }
            await userBusiness.deleteUser(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})