const run = () => {
    console.log('test failing!!');
    throw new Error('test error');
};

run();
