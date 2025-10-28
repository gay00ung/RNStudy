module.exports = function (api) {
    api.cache(true);

    const isTest = process.env.NODE_ENV === 'test';
    
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // 테스트가 아닐 때만 reanimated 플러그인 추가
            ...(!isTest ? ['react-native-reanimated/plugin'] : []),
        ],
        env: {
            test: {
                presets: [
                    ['babel-preset-expo', { jsxRuntime: 'automatic' }]
                ],
            },
        },
    };
};