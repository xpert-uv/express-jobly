const { sqlForPartialUpdate } = require("./sql");

describe("testing the  set sql ", () => {
    test("testing the sqlForPartialUpdate function", () => {
        const response = sqlForPartialUpdate({ firstName: 'Aliya', age: 32 }, { firstName: "firstName", age: "age" });
        expect(response).toEqual({
            setCols: "\"firstName\"=$1, \"age\"=$2", values: ["Aliya", 32]
        })
    })
})