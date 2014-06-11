OUTPUT_FIELDS=$(tr -d " \t\n\r" < src/outputfields.json)

curl -sG 'http://clamo.ftdata.co.uk/api'  -o 'test/stubs/cameron.json' --data-urlencode 'request=[{"action":"search","arguments":{"sort":"date","outputfields":'$OUTPUT_FIELDS',"query":"cameron","offset":0,"limit":10,"suppressdrafts":false}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o 'test/stubs/nokia.json' --data-urlencode 'request=[{"action":"search","arguments":{"sort":"date","outputfields":'$OUTPUT_FIELDS',"query":"company:Nokia","offset":0,"limit":10,"suppressdrafts":false}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o 'test/stubs/post.json' --data-urlencode 'request=[{"action":"getPost","arguments":{"id": 159222,"outputfields":'$OUTPUT_FIELDS'}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o 'test/stubs/notfound.json' --data-urlencode 'request=[{"action":"getPost","arguments":{"id": "fail","outputfields":'$OUTPUT_FIELDS'}}]'