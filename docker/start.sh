
if [ -z "${AIS_VIEW_URL}" ]; then
	AIS_VIEW_URLP=""

else
	AIS_VIEW_URLP="--ais.view.url=https://ais2.e-navigation.net/aisview/rest/store/query?"
fi


LATEST=`ls /archive/target/ais-downloader*SNAPSHOT.war`

java -jar $LATEST $AIS_VIEW_URLP
