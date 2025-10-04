const { compute } = require('./calculator');

// Test suite for the compute function
describe('compute', () => {

  // Test case 1: Addition
  test('should correctly add two numbers', () => {
    expect(compute(2, 3, '+')).toBe(5);
  });

  // Test case 2: Subtraction
  test('should correctly subtract two numbers', () => {
    expect(compute(10, 4, '-')).toBe(6);
  });

  // Test case 3: Multiplication
  test('should correctly multiply two numbers', () => {
    expect(compute(5, 5, '*')).toBe(25);
  });

  // Test case 4: Division
  test('should correctly divide two numbers', () => {
    expect(compute(100, 10, '/')).toBe(10);
  });

  // Test case 5: Division by zero
  test('should return null when dividing by zero', () => {
    expect(compute(5, 0, '/')).toBeNull();
  });
});
