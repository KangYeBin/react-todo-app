const handleRequest = async (requestFunc, onSuccess, onError) => {
  const res = await requestFunc();
  try {
    if (res.status === 200) onSuccess(res.data);
  } catch (error) {
    console.log('error : ' + error);
    if (onError) onError(error);
    else alert('알 수 없는 에러 발생. 다시 시도해주세요');
  }
};

export default handleRequest;
