if [ "$1" != "" ]
then STUBS_LOCATION="$1"
else STUBS_LOCATION='./test/stubs/'
fi

OUTPUT_FIELDS=$(tr -d " \t\n\r" < outputfields.json)

echo 'request=[{"action":"search","arguments":{"sort":"date","outputfields":'$OUTPUT_FIELDS',"query":"status:live","offset":0,"limit":10,"suppressdrafts":false}}]'

curl -sG 'http://clamo.ftdata.co.uk/api'  -o $STUBS_LOCATION'search.json' --data-urlencode 'request=[{"action":"search","arguments":{"sort":"date","outputfields":'$OUTPUT_FIELDS',"query":"status:live","offset":0,"limit":10,"suppressdrafts":false}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o $STUBS_LOCATION'nokia.json' --data-urlencode 'request=[{"action":"search","arguments":{"sort":"date","outputfields":'$OUTPUT_FIELDS',"query":"company:Nokia","offset":0,"limit":10,"suppressdrafts":false}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o $STUBS_LOCATION'post.json' --data-urlencode 'request=[{"action":"getPost","arguments":{"id": 159222,"outputfields":'$OUTPUT_FIELDS'}}]'
curl -sG 'http://clamo.ftdata.co.uk/api'  -o $STUBS_LOCATION'notfound.json' --data-urlencode 'request=[{"action":"getPost","arguments":{"id": "fail","outputfields":'$OUTPUT_FIELDS'}}]'