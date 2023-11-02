// 数据格式转换
const dataFormat = {
    ArrayBufferToBlob(){
        return new Blob([new Uint8Array(buffer, byteOffset, length)]);
    },
    ArrayBufferToBase64(){
        return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
    },
    Base64ToBlob(base64Data, contentType, sliceSize){
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    },
    BlobToArrayBuffer(blob){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject;
            reader.readAsArrayBuffer(blob);
        });
    },
    BlobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    },
    BlobToObjectURL(blob){
        return URL.createObjectURL(blob);
    }
};