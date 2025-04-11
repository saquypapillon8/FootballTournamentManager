const { register } = require('./auth.cjs');

async function test() {
  try {
    await register('testuser', 'securepassword');
    console.log('User registered successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();