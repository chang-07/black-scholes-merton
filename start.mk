/Users/chang/coding/model.mjs: /Users/chang/bsm/model.cpp
    emcc /Users/chang/bsm/model.cpp -o Users/chang/coding/model.mjs \
        -s ENVIRONMENT='web' \
        -s SINGLE_FILE=1 \
        -s EXPORT_NAME='createModelModule' \
        -s USE_ES6_IMPORT_META=0 \
        -I cpp \
        -s EXPORTED_FUNCTIONS='["_getC", "_getP", "_normcdf", "_erf", "_getd1", "_getd2", "_getNPrime", "_getDelta", "_getGamma", "_getTheta", "_getVega", "_getRho", "_cleanup"]' \
        -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
        -O3