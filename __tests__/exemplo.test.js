function soma(a, b) {
    return a + b;
  }
  
  test("Soma 2 + 2 deve ser 4", () => {
    expect(soma(2, 2)).toBe(4);
  });