import { UserBusiness } from "../../src/business/UserBusiness"
import { GetByIdInputDTO } from "../../src/dtos/userDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("getById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve retornar um usuário específico através do 'id' informado", async () => { 
        const input: GetByIdInputDTO = {
            idToFind: "id-mock-normal"
        }

        const response = await userBusiness.getById(input)
        expect(response).toEqual({
            user:{
            id: "id-mock-normal",
            name: "Normal Mock",
            email: "normal@email.com",
            password: "hash-bananinha",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
        }})
    })

    test("deve disparar erro caso 'id' não seja encontrado", async () => { 
        expect.assertions(2)

        try {
            const input: GetByIdInputDTO = {
                idToFind: "id"
            }
            await userBusiness.getById(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})