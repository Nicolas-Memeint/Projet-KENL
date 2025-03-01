var distanceTolerance : float = 0.4;
var maxOpacity : float = 1.0;
private var multiplier : float = 1.2;

private var opacity : float = 1.0;
private var castingPoint : Transform;
private var buffer : float = 0.02;


function Start(){
	GetComponent.<Renderer>().enabled = true;
	castingPoint = transform.Find("Casting Point");
	castingPoint.parent = transform.parent;
	transform.parent = transform.root;
}

function LateUpdate() {
    //Shadow position.
    try {
        transform.position = castingPoint.position;
    } catch (Exception) {
        Destroy(this);
        return;
    }
	
	var hits : RaycastHit[];
	hits = Physics.RaycastAll(transform.position + Vector3.up*0.5, -Vector3.up);
	var maxShadowYPosition : float = -999999;
	for (var i = 0; i < hits.Length; i++){
		var hit : RaycastHit = hits[i];
		var name : String = hit.transform.root.name;
		var takeIt : boolean = true;
		if(name == transform.root.name){
			takeIt = false;
		}
		if(takeIt){
			if(hit.point.y+buffer > maxShadowYPosition){
				maxShadowYPosition = hit.point.y+buffer;
				transform.position.y = hit.point.y+buffer;
				transform.LookAt(transform.position + hit.normal);
			}
		}
	}
	//Opacity distance.
	var distanceShadow : float = Vector3.Distance(transform.position, castingPoint.position);
	opacity = Mathf.Lerp(maxOpacity, 0.0,  distanceShadow * (1/distanceTolerance));
	if(hits.Length == 0){
		opacity = 0.0;
	}
	opacity *= multiplier;
	GetComponent.<Renderer>().material.color.a = opacity;
	//renderer.material.GetColor("_Color").a = opacity;
}